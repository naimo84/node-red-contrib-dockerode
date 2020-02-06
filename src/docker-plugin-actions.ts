import { Red, Node } from 'node-red';
import { DockerConfiguration } from './docker-configuration';
import * as Dockerode from 'dockerode';

module.exports = function (RED: Red) {
 
    function DockerPluginAction(n: any) {
        RED.nodes.createNode(this, n);
        let config = RED.nodes.getNode(n.config) as unknown as DockerConfiguration;
        let client = config.getClient();
        this.on('input', (msg) => {

            let pluginId: string = n.pluginId || msg.payload.pluginId || msg.pluginId || undefined;
            let action = n.action || msg.action || msg.payload.action || undefined;
            let cmd = n.cmd || msg.cmd|| msg.command || msg.payload.command || undefined;

            if (pluginId === undefined && !['list'].includes(action)) {
                this.error("Plugin id/name must be provided via configuration or via `msg.plugin`");
                return;
            }
            this.status({});
            executeAction(pluginId, client, action, cmd, this,msg);
        });

        function executeAction(pluginId: string, client: Dockerode, action: string, cmd: any, node: Node,msg) {

            let remote ={};
            let plugin = client.getPlugin(pluginId, remote);

            switch (action) {

                case 'list':
                    // https://docs.docker.com/engine/api/v1.40/#operation/NodeList
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
                        plugin.pull(cmd)
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
                        plugin.upgrade(cmd)
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

