import { Red, Node } from 'node-red';
import { DockerConfiguration } from './docker-configuration';
import * as Dockerode from 'dockerode';

module.exports = function (RED: Red) {
 
    function DockerPluginAction(n: any) {
        RED.nodes.createNode(this, n);
        let config = RED.nodes.getNode(n.config) as unknown as DockerConfiguration;
        let client = config.getClient();
        this.on('input', (msg) => {

            let pluginId: string = n.plugin || msg.payload.pluginId || msg.pluginId || undefined;
            let action = n.action || msg.action || msg.payload.action || undefined;
            let options = n.options || msg.options || msg.payload.options || undefined;

            if (pluginId === undefined && !['list', 'prune', 'create'].includes(action)) {
                this.error("Plugin id/name must be provided via configuration or via `msg.plugin`");
                return;
            }
            this.status({});
            executeAction(pluginId, options, client, action, this,msg);
        });

        function executeAction(pluginId: string, options: any, client: Dockerode, action: string, node: Node ,msg) {

            let remote ={};
            let plugin = client.getPlugin(pluginId, remote);

            switch (action) {

                case 'list':
                    // https://docs.docker.com/engine/api/v1.40/#operation/PluginList
                    client.listPlugins({ all: true })
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: pluginId + ' started' });
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
                    // https://docs.docker.com/engine/api/v1.40/#operation/PluginInspect
                    plugin.inspect()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: pluginId + ' started' });
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
                    // https://docs.docker.com/engine/api/v1.40/#operation/PluginDelete
                    plugin.remove()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: pluginId + ' remove' });
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

                case 'enable':
                    // https://docs.docker.com/engine/api/v1.40/#operation/PluginEndable
                    plugin.enable()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: pluginId + ' remove' });
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

                    case 'disable':
                        // https://docs.docker.com/engine/api/v1.40/#operation/PluginDisable
                        plugin.disable()
                            .then(res => {
                                node.status({ fill: 'green', shape: 'dot', text: pluginId + ' remove' });
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

                    case 'configure':
                        // https://docs.docker.com/engine/api/v1.40/#operation/PluginConfigue
                        plugin.configure()
                            .then(res => {
                                node.status({ fill: 'green', shape: 'dot', text: pluginId + ' remove' });
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


                    case 'privileges':
                        // https://docs.docker.com/engine/api/v1.40/#operation/PluginPrivledges
                        plugin.privileges()
                            .then(res => {
                                node.status({ fill: 'green', shape: 'dot', text: pluginId + ' remove' });
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
                    case 'push':
                        // https://docs.docker.com/engine/api/v1.40/#operation/PluginPush
                        plugin.push()
                            .then(res => {
                                node.status({ fill: 'green', shape: 'dot', text: pluginId + ' remove' });
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

                    case 'pull':
                        // https://docs.docker.com/engine/api/v1.40/#operation/PluginPull
                        plugin.pull(options)
                            .then(res => {
                                node.status({ fill: 'green', shape: 'dot', text: pluginId + ' remove' });
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

                    case 'upgrade':
                        // https://docs.docker.com/engine/api/v1.40/#operation/PluginUpgrade
                        plugin.upgrade(options)
                            .then(res => {
                                node.status({ fill: 'green', shape: 'dot', text: pluginId + ' remove' });
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

                    case 'create':
                        // https://docs.docker.com/engine/api/v1.40/#operation/PluginCreate
                        client.createPlugin(options)
                            .then(res => {
                                node.status({ fill: 'green', shape: 'dot', text: pluginId + ' remove' });
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

    RED.httpAdmin.post("/pluginSearch", function (req, res) {
        RED.log.debug("POST /pluginSearch");

        const nodeId = req.body.id;
        let config = RED.nodes.getNode(nodeId);

        discoverSonos(config, (plugins) => {
            RED.log.debug("GET /pluginSearch: " + plugins.length + " found");
            res.json(plugins);
        });
    });

    function discoverSonos(config, discoveryCallback) {
        let client = config.getClient();
        client.listPlugins({ all: true })
            .then(plugins => discoveryCallback(plugins))
            .catch(err => this.error(err));
    }
    
    RED.nodes.registerType('docker-plugin-actions', DockerPluginAction);
}

