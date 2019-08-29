import { Red, Node } from 'node-red';
import { DockerConfig } from './docker-config';
import * as Dockerode from 'dockerode';
let stream = require('stream');

module.exports = function (RED: Red) {
    'use strict';

    function DockerContainerAction(n: any) {
        RED.nodes.createNode(this, n);
        let config = RED.nodes.getNode(n.config) as unknown as DockerConfig;
        let client = config.getClient();
        this.on('input', (msg) => {

            let cid: string = n.container || msg.container || undefined;
            let action = n.action || msg.action || msg.payload || undefined;
            let cmd = n.cmd || msg.cmd|| msg.command || undefined;

            if (cid === undefined) {
                this.error("Container id/name must be provided via configuration or via `msg.container`");
                return;
            }
            this.status({});
            executeAction(cid, client, action, cmd, this);
        });

        function executeAction(cid: string, client: Dockerode, action: string, cmd: any, node: Node) {

            let container = client.getContainer(cid);

            switch (action) {
                case 'start':
                    container.start()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: cid + ' started' });
                            node.send({ payload: res });
                        }).catch(err => {
                            if (err.statusCode === 304) {
                                node.warn(`Unable to start container "${cid}", container is already started.`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error starting container:  [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
                case 'stop':
                    container.stop()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: cid + ' stopped' });
                            node.send({ payload: res });
                        }).catch(err => {
                            if (err.statusCode === 304) {
                                node.warn(`Unable to stop container "${cid}", container is already stopped.`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error stopping container: [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
                case 'restart':
                    container.restart()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: cid + ' restarted' });
                            node.send({ payload: res });
                        }).catch(err => {
                            if (err.statusCode === 304) {
                                node.warn(`Unable to restart container "${cid}".`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error restarting container: [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
                case 'kill':
                    container.kill()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: cid + ' killed' });
                            node.send({ payload: res });
                        }).catch(err => {
                            if (err.statusCode === 304) {
                                node.warn(`Unable to kill container "${cid}".`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error killing container: [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
                case 'exec':
                    let options = {
                        Cmd: ['sh', '-c', cmd],
                        AttachStdout: true,
                        AttachStderr: true
                    };
                    container.exec(options)
                        .then(res => {
                            if (res) {
                                res.start((err, input_stream) => {
                                    if (err) {
                                        //console.log("error : " + err);
                                        return;
                                    }

                                    var stdout = new stream.PassThrough();
                                    var stderr = new stream.PassThrough();
                                    container.modem.demuxStream(input_stream, stdout, stderr);

                                    let buffer_stdout = "";
                                    stdout.on('data', (chunk) => {
                                        buffer_stdout += chunk.toString();
                                    });

                                    let buffer_stderr = "";
                                    stderr.on('data', (chunk) => {
                                        buffer_stderr += chunk.toString();
                                    });

                                    input_stream.on('end', () => {
                                        node.send({ payload: buffer_stdout });
                                        if(buffer_stderr.trim().length>0){
                                            node.error(`Error exec container: ${buffer_stderr}`);
                                        }
                                    });
                                });
                            }

                        }).catch(err => {
                            if (err.statusCode === 304) {
                                node.warn(`Unable to exec container "${cid}".`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error exec container: [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;


                default:
                    node.error(`Called with an unknown action: ${action}`);
                    return;
            }
        }
    }

    RED.nodes.registerType('docker-container-actions', DockerContainerAction);
}

