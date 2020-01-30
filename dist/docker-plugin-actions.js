"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function DockerPluginAction(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        var client = config.getClient();
        this.on('input', function (msg) {
            var cid = n.plugin || msg.plugin || undefined;
            var action = n.action || msg.action || msg.payload || undefined;
            var cmd = n.cmd || msg.cmd || msg.command || undefined;
            if (cid === undefined) {
                _this.error("Plugin id/name must be provided via configuration or via `msg.plugin`");
                return;
            }
            _this.status({});
            executeAction(cid, client, action, cmd, _this, msg);
        });
        function executeAction(cid, client, action, cmd, node, msg) {
            console.log(cmd);
            var remote = {};
            var plugin = client.getPlugin(cid, remote);
            switch (action) {
                case 'inspect':
                    plugin.inspect()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' started' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to start plugin \"" + cid + "\", plugin is already started.");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error starting plugin:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'remove':
                    plugin.remove()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to stop plugin \"" + cid + "\", plugin is already removed.");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error removing plugin: [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'enable':
                    plugin.enable()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to stop plugin \"" + cid + "\", plugin is already removed.");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error removing plugin: [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'disable':
                    plugin.disable()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to stop plugin \"" + cid + "\", plugin is already removed.");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error removing plugin: [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'configure':
                    plugin.configure()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to stop plugin \"" + cid + "\", plugin is already removed.");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error removing plugin: [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'privileges':
                    plugin.privileges()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to stop plugin \"" + cid + "\", plugin is already removed.");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error removing plugin: [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'push':
                    plugin.push()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to stop plugin \"" + cid + "\", plugin is already removed.");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error removing plugin: [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                /*
                                    case 'pull':
                                        plugin.pull()
                                            .then(res => {
                                                node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
                                                node.send(Object.assign(msg,{ payload: res }));
                                            }).catch(err => {
                                                if (err.statusCode === 304) {
                                                    node.warn(`Unable to stop plugin "${cid}", plugin is already removed.`);
                                                    node.send({ payload: err });
                                                } else {
                                                    node.error(`Error removing plugin: [${err.statusCode}] ${err.reason}`);
                                                    return;
                                                }
                                            });
                                        break;
                
                                    case 'upgrade':
                                        plugin.upgrade()
                                            .then(res => {
                                                node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
                                                node.send(Object.assign(msg,{ payload: res }));
                                            }).catch(err => {
                                                if (err.statusCode === 304) {
                                                    node.warn(`Unable to stop plugin "${cid}", plugin is already removed.`);
                                                    node.send({ payload: err });
                                                } else {
                                                    node.error(`Error removing plugin: [${err.statusCode}] ${err.reason}`);
                                                    return;
                                                }
                                            });
                                        break;
                */
                default:
                    node.error("Called with an unknown action: " + action);
                    return;
            }
        }
    }
    RED.nodes.registerType('docker-plugin-actions', DockerPluginAction);
};
