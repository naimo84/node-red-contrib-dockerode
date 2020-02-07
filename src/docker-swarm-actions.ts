import { Red, Node } from 'node-red';
import { DockerConfiguration } from './docker-configuration';
import * as Dockerode from 'dockerode';

module.exports = function (RED: Red) {
 
    function DockerSwarmAction(n: any) {
        RED.nodes.createNode(this, n);
        let config = RED.nodes.getNode(n.config) as unknown as DockerConfiguration;
        let client = config.getClient();
        this.on('input', (msg) => {

           
            let action = n.action || msg.action || msg.payload.action || undefined;
            let options = n.options || msg.options|| msg.options || msg.payload.options || undefined;

            this.status({});
            executeAction( options, client, action, this,msg);
        });

        function executeAction(options: any, client: Dockerode, action: string,  node: Node,msg) {

            let swarm = client;

            switch (action) {
                case 'inspect':
                    // https://docs.docker.com/engine/api/v1.40/#operation/SwarmInspect
                    swarm.swarmInspect()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text:  ' started' });
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
                    // https://docs.docker.com/engine/api/v1.40/#operation/SwarmUpdate
                    swarm.swarmUpdate(options)
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

                case 'join':
                    // https://docs.docker.com/engine/api/v1.40/#operation/SwarmJoin
                    swarm.swarmJoin(options)
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
                case 'leave':
                    // https://docs.docker.com/engine/api/v1.40/#operation/SwarmLeave
                    swarm.swarmLeave(options)
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

                case 'init':
                    // https://docs.docker.com/engine/api/v1.40/#operation/SwarmInit
                    swarm.swarmInit(options)
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: ' remove' });
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

