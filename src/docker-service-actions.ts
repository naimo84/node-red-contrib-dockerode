import { Red, Node } from 'node-red';
import { DockerConfiguration } from './docker-configuration';
import * as Dockerode from 'dockerode';

module.exports = function (RED: Red) {
 

    function DockerServiceAction(n: any) {
        RED.nodes.createNode(this, n);
        let config = RED.nodes.getNode(n.config) as unknown as DockerConfiguration;
        let client = config.getClient();
        this.on('input', (msg) => {

            let cid: string = n.service || msg.service || undefined;
            let action = n.action || msg.action || msg.payload || undefined;
            let cmd = n.cmd || msg.cmd|| msg.command || undefined;

            if (cid === undefined) {
                this.error("Service id/name must be provided via configuration or via `msg.service`");
                return;
            }
            this.status({});
            executeAction(cid, client, action, cmd, this,msg);
        });

        function executeAction(cid: string, client: Dockerode, action: string, cmd: any, node: Node,msg) {
            console.log(cmd);
            let service = client.getService(cid);

            switch (action) {
                case 'inspect':
                    service.inspect()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: cid + ' started' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 304) {
                                node.warn(`Unable to start service "${cid}", service is already started.`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error starting service:  [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
/*                case 'update':
                    service.update()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: cid + ' stopped' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 304) {
                                node.warn(`Unable to stop service "${cid}", service is already stopped.`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error stopping service: [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
*/
                case 'remove':
                    service.remove()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 304) {
                                node.warn(`Unable to stop service "${cid}", service is already removed.`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error removing service: [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
//Todo: tail
                case 'logs':
                    service.logs()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: cid + ' killed' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 304) {
                                node.warn(`Unable to kill service "${cid}".`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error killing service: [${err.statusCode}] ${err.reason}`);
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

    RED.nodes.registerType('docker-service-actions', DockerServiceAction);
}

