import { Red, Node } from 'node-red';
import { DockerConfiguration } from './docker-configuration';
import * as Dockerode from 'dockerode';

module.exports = function (RED: Red) {

    function DockerNodeAction(n: any) {
        RED.nodes.createNode(this, n);
        let config = RED.nodes.getNode(n.config) as unknown as DockerConfiguration;
        let client = config.getClient();
        this.on('input', (msg) => {

            let nodeId: string = n.node || msg.payload.nodeId || msg.nodeId || undefined;
            let action = n.action || msg.action || msg.payload.action || undefined;

            if (nodeId === undefined && !['list', 'prune', 'create'].includes(action)) {
                this.error("Node id/name must be provided via configuration or via `msg.node`");
                return;
            }
            this.status({});
            executeAction(nodeId, client, action, this, msg, {
                options: RED.util.evaluateNodeProperty(n.options !== '' ? n.options : '{}', n.optionstype, n, msg) || {},
            });
        });

        function executeAction(nodeId: string, client: Dockerode, action: string, node: Node, msg, config: { options: {} }) {

            let nodeClient = client.getNode(nodeId);

            switch (action) {

                case 'list':
                    // https://docs.docker.com/engine/api/v1.40/#operation/NodeList
                    client.listNodes({ all: true })
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: nodeId + ' started' });
                            node.send(Object.assign(msg, { payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 400) {
                                node.error(`Bad parameter:  ${err.reason}`, msg);
                                node.send({ payload: err });
                            } else if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`, msg);
                                node.send({ payload: err });
                            } else {
                                node.error(`System Error:  [${err.statusCode}] ${err.reason}`, msg);
                                return;
                            }
                        });
                    break;
                case 'inspect':
                    // https://docs.docker.com/engine/api/v1.40/#operation/NodeInspect
                    nodeClient.inspect()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: nodeId + ' started' });
                            node.send(Object.assign(msg, { payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`, msg);
                                node.send({ payload: err });
                            } else {
                                node.error(`System Error:  [${err.statusCode}] ${err.reason}`, msg);
                                return;
                            }
                        });
                    break;
                case 'remove':
                    // https://docs.docker.com/engine/api/v1.40/#operation/NodeDelete
                    nodeClient.remove()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: nodeId + ' stopped' });
                            node.send(Object.assign(msg, { payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`, msg);
                                node.send({ payload: err });
                            } else {
                                node.error(`System Error:  [${err.statusCode}] ${err.reason}`, msg);
                                return;
                            }
                        });
                    break;
                case 'update':
                    // https://docs.docker.com/engine/api/v1.40/#operation/NodeUpdate
                    nodeClient.update(config.options)
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: nodeId + ' restarted' });
                            node.send(Object.assign(msg, { payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`, msg);
                                node.send({ payload: err });
                            } else {
                                node.error(`System Error: [${err.statusCode}] ${err}`, msg);
                                return;
                            }
                        });
                    break;


                default:
                    node.error(`Called with an unknown action: ${action}`, msg);
                    return;
            }
        }
    }


    RED.httpAdmin.post("/nodeSearch", RED.auth.needsPermission('flows.write'), function (req, res) {
        RED.log.debug("POST /nodeSearch");

        const nodeId = req.body.id;
        let config = RED.nodes.getNode(nodeId);

        discoverSonos(config, (nodes) => {
            RED.log.debug("GET /nodeSearch: " + nodes.length + " found");
            res.json(nodes);
        });
    });

    function discoverSonos(config, discoveryCallback) {
        let client = config.getClient();
        client.listNodes({ all: true })
            .then(nodes => discoveryCallback(nodes))
            .catch(err => this.error(err));
    }


    RED.nodes.registerType('docker-node-actions', DockerNodeAction);
}

