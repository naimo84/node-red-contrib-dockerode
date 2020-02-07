import { Red, Node } from 'node-red';
import { DockerConfiguration } from './docker-configuration';
import * as Dockerode from 'dockerode';

module.exports = function (RED: Red) {
 
    function DockerConfigAction(n: any) {
        RED.nodes.createNode(this, n);
        let config = RED.nodes.getNode(n.config) as unknown as DockerConfiguration;
        let client = config.getClient();
        this.on('input', (msg) => {
            RED.log.debug(msg);
            let configId: string = n.config || msg.payload.configId || msg.configId || undefined;
            let action = n.action || msg.action || msg.payload.action || undefined;
            let options = n.options || msg.options || msg.payload.options || undefined;
            if (configId === undefined && !['list', 'prune', 'create'].includes(action)) {
                this.error("Config id/name must be provided via configuration or via `msg.config`");
                return;
            }
            this.status({});
            executeAction(configId, options, client, action, this,msg);
        });

        function executeAction(configId: string, options: any, client: Dockerode, action: string, node: Node,msg) {

            let config = client.getConfig(configId);

            switch (action) {

                case 'list':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ConfigList
                    client.listConfigs({ all: true })
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: configId + ' started' });
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

                case 'create':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ConfigCreate
                    client.createConfig(options)
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: configId + ' remove' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`);
                                node.send({ payload: err });
                            } else if (err.statusCode === 409) {
                                node.error(`Name conflicts with an existing objectd: [${configId}]`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Sytem Error:  [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;

                case 'inspect':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ConfigInspect
                    config.inspect()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: configId + ' started' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 503) {
                                node.error(`Node is not part of a swarm: [${configId}]`);
                                node.send({ payload: err });
                            } else if (err.statusCode === 404) {
                                node.error(`Config not found: [${configId}]`);
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

                case 'remove':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ConfigDelete
                    config.remove()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: configId + ' remove' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 503) {
                                node.error(`Node is not part of a swarm: [${configId}]`);
                                node.send({ payload: err });
                            } else if (err.statusCode === 404) {
                                node.error(`Config not found: [${configId}]`);
                                node.send({ payload: err });
                            } else if(err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Sytem Error:  [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;

                case 'update':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ConfigUpdate
                    config.update()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: configId + ' remove' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 503) {
                                node.error(`Node is not part of a swarm: [${configId}]`);
                                node.send({ payload: err });
                            } else if (err.statusCode === 400) {
                                node.error(`Bad parameter: [${configId}]`);
                                node.send({ payload: err });
                            } else if (err.statusCode === 404) {
                                node.error(`Config not found: [${configId}]`);
                                node.send({ payload: err });
                            } else if(err.statusCode === 500) {
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

    
    RED.httpAdmin.post("/configSearch", function (req, res) {
        RED.log.debug("POST /configSearch");

        const nodeId = req.body.id;
        let config = RED.nodes.getNode(nodeId);

        discoverSonos(config, (configs) => {
            RED.log.debug("GET /configSearch: " + configs.length + " found");
            res.json(configs);
        });
    });

    function discoverSonos(config, discoveryCallback) {
        let client = config.getClient();
        client.listConfigs({ all: true })
            .then(configs => discoveryCallback(configs))
            .catch(err => this.error(err));
    }

    RED.nodes.registerType('docker-config-actions', DockerConfigAction);
}

