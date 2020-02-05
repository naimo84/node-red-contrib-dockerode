import { Red, Node } from 'node-red';
import { DockerConfiguration } from './docker-configuration';
import * as Dockerode from 'dockerode';

module.exports = function (RED: Red) {
 
    function DockerSwarmAction(n: any) {
        RED.nodes.createNode(this, n);
        let config = RED.nodes.getNode(n.config) as unknown as DockerConfiguration;
        let client = config.getClient();
        this.on('input', (msg) => {

            let cid: string = n.swarm || msg.swarm || undefined;
            let action = n.action || msg.action || msg.payload || undefined;
            let cmd = n.cmd || msg.cmd|| msg.command || undefined;

            this.status({});
            executeAction(cid, client, action, cmd, this,msg);
        });

        function executeAction(cid: string, client: Dockerode, action: string, cmd: any, node: Node,msg) {
            console.log(cmd);
            let swarm = client;

            switch (action) {
                case 'inspect':
                    swarm.swarmInspect()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: cid + ' started' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 304) {
                                node.warn(`Unable to start swarm "${cid}", swarm is already started.`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error starting swarm:  [${err.statusCode}] ${err.reason}`);
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
                            if (err.statusCode === 304) {
                                node.warn(`Unable to stop swarm "${cid}", swarm is already stopped.`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error stopping swarm: [${err.statusCode}] ${err.reason}`);
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
                            if (err.statusCode === 304) {
                                node.warn(`Unable to stop swarm "${cid}", swarm is already removed.`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error removing swarm: [${err.statusCode}] ${err.reason}`);
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
                            if (err.statusCode === 304) {
                                node.warn(`Unable to leaving swarm "${cid}", swarm is already left.`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error leaving swarm: [${err.statusCode}] ${err.reason}`);
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
                            if (err.statusCode === 304) {
                                node.warn(`Unable to init swarm "${cid}", swarm is already init.`);
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

