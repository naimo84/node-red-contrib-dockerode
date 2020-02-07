"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function DockerPluginAction(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        var client = config.getClient();
        this.on('input', function (msg) {
            var pluginId = n.pluginId || msg.payload.pluginId || msg.pluginId || undefined;
            var action = n.action || msg.action || msg.payload.action || undefined;
            var options = n.options || msg.options || msg.payload.options || undefined;
            if (pluginId === undefined && !['list', 'prune', 'create'].includes(action)) {
                _this.error("Plugin id/name must be provided via configuration or via `msg.plugin`");
                return;
            }
            _this.status({});
            executeAction(pluginId, options, client, action, _this, msg);
        });
        function executeAction(pluginId, options, client, action, node, msg) {
            var remote = {};
            var plugin = client.getPlugin(pluginId, remote);
            switch (action) {
                case 'list':
                    // https://docs.docker.com/engine/api/v1.40/#operation/PluginList
                    client.listPlugins({ all: true })
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: pluginId + ' started' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 400) {
                            node.error("Bad parameter:  " + err.reason);
                            node.send({ payload: err });
                        }
                        else if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'inspect':
                    // https://docs.docker.com/engine/api/v1.40/#operation/PluginInspect
                    plugin.inspect()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: pluginId + ' started' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'remove':
                    // https://docs.docker.com/engine/api/v1.40/#operation/PluginDelete
                    plugin.remove()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: pluginId + ' remove' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'enable':
                    // https://docs.docker.com/engine/api/v1.40/#operation/PluginEndable
                    plugin.enable()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: pluginId + ' remove' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'disable':
                    // https://docs.docker.com/engine/api/v1.40/#operation/PluginDisable
                    plugin.disable()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: pluginId + ' remove' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'configure':
                    // https://docs.docker.com/engine/api/v1.40/#operation/PluginConfigue
                    plugin.configure()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: pluginId + ' remove' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'privileges':
                    // https://docs.docker.com/engine/api/v1.40/#operation/PluginPrivledges
                    plugin.privileges()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: pluginId + ' remove' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'push':
                    // https://docs.docker.com/engine/api/v1.40/#operation/PluginPush
                    plugin.push()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: pluginId + ' remove' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'pull':
                    // https://docs.docker.com/engine/api/v1.40/#operation/PluginPull
                    plugin.pull(options)
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: pluginId + ' remove' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'upgrade':
                    // https://docs.docker.com/engine/api/v1.40/#operation/PluginUpgrade
                    plugin.upgrade(options)
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: pluginId + ' remove' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'create':
                    // https://docs.docker.com/engine/api/v1.40/#operation/PluginCreate
                    client.createPlugin(options)
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: pluginId + ' remove' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                default:
                    node.error("Called with an unknown action: " + action);
                    return;
            }
        }
    }
    RED.httpAdmin.post("/pluginSearch", function (req, res) {
        RED.log.debug("POST /pluginSearch");
        var nodeId = req.body.id;
        var config = RED.nodes.getNode(nodeId);
        discoverSonos(config, function (plugins) {
            RED.log.debug("GET /pluginSearch: " + plugins.length + " found");
            res.json(plugins);
        });
    });
    function discoverSonos(config, discoveryCallback) {
        var _this = this;
        var client = config.getClient();
        client.listPlugins({ all: true })
            .then(function (plugins) { return discoveryCallback(plugins); })
            .catch(function (err) { return _this.error(err); });
    }
    RED.nodes.registerType('docker-plugin-actions', DockerPluginAction);
};
