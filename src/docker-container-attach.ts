import { Red, Node } from 'node-red';
import { DockerConfiguration } from './docker-configuration';
import * as Dockerode from 'dockerode';

let stream = require('stream');

module.exports = function (RED: Red) {
 
    function DockerContainerAttach(n: any) {
        RED.nodes.createNode(this, n);
        let config = RED.nodes.getNode(n.config) as unknown as DockerConfiguration;
        let client = config.getClient();
        this.on('input', (msg) => {

            let cid: string = n.container || msg.container || undefined;
            let cmd = n.cmd || msg.cmd|| msg.command || undefined;

            if (cid === undefined) {
                this.error("Container id/name must be provided via configuration or via `msg.container`");
                return;
            }
            this.status({});
            executeAttach(cid, client, cmd, this,msg);
        });
    }

    function executeAttach(cid: string, client: Dockerode, cmd: any, node: Node,msg) {

        let container = client.getContainer(cid);

        let options = {
            Cmd: ['sh', '-c', cmd],
            AttachStdout: true,
            AttachStderr: true
        };
        container.exec(options).then(res => {
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
                        node.send(Object.assign(msg,{ payload: buffer_stdout }));                                       
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
    }
    RED.nodes.registerType('docker-container-attach', DockerContainerAttach);
}