import { Red, Node } from 'node-red';
import { DockerConfiguration } from './docker-configuration';
import * as Dockerode from 'dockerode';

module.exports = function (RED: Red) {
 
    function DockerNodeAction(n: any) {
        RED.nodes.createNode(this, n);
        let config = RED.nodes.getNode(n.config) as unknown as DockerConfiguration;
        let client = config.getClient();
        this.on('input', (msg) => {

            let nodeId: string = n.nodeId || msg.payload.nodeId || msg.nodeId || undefined;
            let action = n.action || msg.action || msg.payload.action || undefined;

            if (nodeId === undefined && !['list'].includes(action)) {
                this.error("Node id/name must be provided via configuration or via `msg.node`");
                return;
            }
            this.status({});
            executeAction(nodeId, client, action, this,msg);
        });

        function executeAction(nodeId: string, client: Dockerode, action: string, node: Node,msg) {

            let nodeClient = client.getNode(nodeId);

            switch (action) {


                case 'list':
                    // https://docs.docker.com/engine/api/v1.40/#operation/NodeList
                    client.listNetworks({ all: true })
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: nodeId + ' started' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 400) {
                                node.error(`Bad parameter:  ${err.reason}`);
                                node.send({ payload: err });
                            } else if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Sytem Error:  [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
                case 'inspect':
                    nodeClient.inspect()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: nodeId + ' started' });
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
                case 'remove':
                    nodeClient.remove()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: nodeId + ' stopped' });
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
                    nodeClient.update()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: nodeId + ' restarted' });
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

    RED.nodes.registerType('docker-node-actions', DockerNodeAction);
}

