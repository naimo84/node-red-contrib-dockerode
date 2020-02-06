import { Red, Node } from 'node-red';
import { DockerConfiguration } from './docker-configuration';
import * as Dockerode from 'dockerode';

module.exports = function (RED: Red) {
 
    function DockerEngineAction(n: any) {
        RED.nodes.createNode(this, n);
        let config = RED.nodes.getNode(n.config) as unknown as DockerConfiguration;
        let client = config.getClient();
        this.on('input', (msg) => {

            let action = n.action || msg.action || msg.payload.action || undefined;
            let cmd = n.cmd || msg.cmd|| msg.command || msg.payload.command || undefined;
            let file = n.cmd || msg.cmd|| msg.command || undefined;
            let containerId: string = n.containerId || msg.payload.containerId || msg.containerId || n.containerName || msg.payload.containerName || msg.containerName || undefined;
            if (containerId === undefined && !['list'].includes(action)) {
                this.error("Container id/name must be provided via configuration or via `msg.containerId`");
                return;
            }
            this.status({});
            executeAction(containerId, file, client, action, cmd, this,msg);
        });

        function executeAction(containerId: string, file: File, client: Dockerode, action: string, cmd: any, node: Node,msg) {

            let engine = client;

            switch (action) {
                case 'auth':
                    engine.checkAuth(cmd)
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: ' remove' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Sytem Error:  [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
                case 'info':
                    engine.info()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: ' remove' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Sytem Error:  [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;

                case 'version':
                    engine.version()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: 'Engine started' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Sytem Error:  [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
                case 'ping':
                    engine.ping()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: ' remove' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Sytem Error:  [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
                case 'df':
                    engine.df()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: ' remove' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Sytem Error:  [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
                case 'import-image':
                    engine.importImage(cmd, file)
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: ' remove' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Sytem Error:  [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
/*                    case 'run':
                        engine.run()
                            .then(res => {
                                node.status({ fill: 'green', shape: 'dot', text: ' remove' });
                                node.send(Object.assign(msg,{ payload: res }));
                            }).catch(err => {
                                if (err.statusCode === 500) {
                                    node.error(`Server Error: [${err.statusCode}] ${err.reason}`);
                                    node.send({ payload: err });
                                } else {
                                    node.error(`Sytem Error:  [${err.statusCode}] ${err.reason}`);
                                    return;
                                }
                            });
                        break;
*/
                case 'build':
                    engine.buildImage(cmd)
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: ' stopped' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Sytem Error:  [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;


                case 'exec-start':
                    engine.getExec(containerId).start(cmd)
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: ' remove' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Sytem Error:  [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
                case 'exec-resize':
                    engine.getExec(containerId).start(cmd)
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' remove' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Sytem Error:  [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
                case 'exec-json':
                    engine.getExec(containerId).inspect()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' remove' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Sytem Error:  [${err.statusCode}] ${err.reason}`);
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

