"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function DockerPluginAction(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        var client = config.getClient();
        this.on('input', function (msg) {
            var cid = n.container || msg.payload.container || msg.container || undefined;
            var action = n.action || msg.action || msg.payload.action || undefined;
            var cmd = n.cmd || msg.cmd || msg.command || msg.payload.command || undefined;
            if (cid === undefined) {
                _this.error("Plugin id/name must be provided via configuration or via `msg.plugin`");
                return;
            }
            _this.status({});
            executeAction(cid, client, action, cmd, _this, msg);
        });
        function executeAction(cid, client, action, cmd, node, msg) {
            var remote = {};
            var plugin = client.getPlugin(cid, remote);
            switch (action) {
                case 'inspect':
                    plugin.inspect()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' started' });
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
                    plugin.remove()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
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
                    plugin.enable()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
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
                    plugin.disable()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
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
                    plugin.configure()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
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
                    plugin.privileges()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
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
                    plugin.push()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
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
                    plugin.pull(cmd)
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
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
                    plugin.upgrade(cmd)
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
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
    RED.nodes.registerType('docker-plugin-actions', DockerPluginAction);
};
