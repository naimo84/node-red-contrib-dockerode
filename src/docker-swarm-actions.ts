import { Red, Node } from 'node-red';
import { DockerConfiguration } from './docker-configuration';
import * as Dockerode from 'dockerode';

module.exports = function (RED: Red) {
 
    function DockerSwarmAction(n: any) {
        RED.nodes.createNode(this, n);
        let config = RED.nodes.getNode(n.config) as unknown as DockerConfiguration;
        let client = config.getClient();
        this.on('input', (msg) => {

            let cid: string = n.container || msg.payload.container || msg.container || undefined;
            let action = n.action || msg.action || msg.payload.action || undefined;
            let cmd = n.cmd || msg.cmd|| msg.command || msg.payload.command || undefined;

            this.status({});
            executeAction(cid, client, action, cmd, this,msg);
        });

        function executeAction(cid: string, client: Dockerode, action: string, cmd: any, node: Node,msg) {

            let swarm = client;

            switch (action) {
                case 'inspect':
                    swarm.swarmInspect()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: cid + ' started' });
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
                case 'update':
                    swarm.swarmUpdate(cmd)
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: cid + ' stopped' });
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

                case 'join':
                    swarm.swarmJoin(cmd)
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
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
                case 'leave':
                    swarm.swarmLeave(cmd)
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
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
                case 'init':
                    swarm.swarmInit(cmd)
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`);
                                node.send({ payload: err });
                            }else if (err.statusCode === 400) {
                                node.warn(`Unable to init swarm. Bad payload.`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error init swarm: [${err.statusCode}] ${err.reason}`);
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

    RED.nodes.registerType('docker-swarm-actions', DockerSwarmAction);
}

