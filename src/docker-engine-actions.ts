import { Red, Node } from 'node-red';
import { DockerConfiguration } from './docker-configuration';
import * as Dockerode from 'dockerode';

module.exports = function (RED: Red) {
 
    function DockerEngineAction(n: any) {
        RED.nodes.createNode(this, n);
        let config = RED.nodes.getNode(n.config) as unknown as DockerConfiguration;
        let client = config.getClient();
        this.on('input', (msg) => {

            let cid: string = n.engine || msg.engine || undefined;
            let action = n.action || msg.action || msg.payload || undefined;
            let cmd = n.cmd || msg.cmd|| msg.command || undefined;
            let file = n.cmd || msg.cmd|| msg.command || undefined;

            this.status({});
            executeAction(cid, client, action, cmd, file, this,msg);
        });

        function executeAction(cid: string, client: Dockerode, action: string, cmd: any, file: File, node: Node,msg) {
            console.log(cmd);
            let engine = client;

            switch (action) {
                case 'version':
                    engine.version()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: cid + ' started' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 304) {
                                node.warn(`Unable to start engine "${cid}", engine is already started.`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error starting engine:  [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
                case 'info':
                    engine.info()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 304) {
                                node.warn(`Unable to init engine "${cid}", engine is already init.`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error init engine: [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
                case 'ping':
                    engine.ping()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 304) {
                                node.warn(`Unable to init engine "${cid}", engine is already init.`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error init engine: [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
                case 'df':
                    engine.df()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 304) {
                                node.warn(`Unable to init engine "${cid}", engine is already init.`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error init engine: [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
                case 'import-image':
                    engine.importImage(cmd, file)
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 304) {
                                node.warn(`Unable to init engine "${cid}", engine is already init.`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error init engine: [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
/*                    case 'run':
                        engine.run()
                            .then(res => {
                                node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
                                node.send(Object.assign(msg,{ payload: res }));
                            }).catch(err => {
                                if (err.statusCode === 304) {
                                    node.warn(`Unable to init engine "${cid}", engine is already init.`);
                                    node.send({ payload: err });
                                } else {
                                    node.error(`Error init engine: [${err.statusCode}] ${err.reason}`);
                                    return;
                                }
                            });
                        break;
*/
                case 'build':
                    engine.buildImage(cmd)
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: cid + ' stopped' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 304) {
                                node.warn(`Unable to stop engine "${cid}", engine is already stopped.`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error stopping engine: [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;

                case 'auth':
                    engine.checkAuth(cmd)
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 304) {
                                node.warn(`Unable to stop engine "${cid}", engine is already removed.`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error removing engine: [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
                case 'exec-start':
                    engine.getExec(cid).start(cmd)
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 304) {
                                node.warn(`Unable to leaving engine "${cid}", engine is already left.`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error leaving engine: [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
                case 'exec-resize':
                    engine.getExec(cid).start(cmd)
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 304) {
                                node.warn(`Unable to init engine "${cid}", engine is already init.`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error init engine: [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
                case 'exec-json':
                    engine.getExec(cid).inspect()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 304) {
                                node.warn(`Unable to init engine "${cid}", engine is already init.`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error init engine: [${err.statusCode}] ${err.reason}`);
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

    RED.nodes.registerType('docker-engine-actions', DockerEngineAction);
}

