"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function DockerEngineAction(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        var client = config.getClient();
        this.on('input', function (msg) {
            var action = n.action || msg.action || msg.payload.action || undefined;
            var options = n.options || msg.options || msg.options || msg.payload.options || undefined;
            var file = n.options || msg.options || msg.options || undefined;
            var containerId = n.containerId || msg.payload.containerId || msg.containerId || n.containerName || msg.payload.containerName || msg.containerName || undefined;
            if (containerId === undefined && !['list', 'prune', 'create'].includes(action)) {
                _this.error("Container id/name must be provided via configuration or via `msg.containerId`");
                return;
            }
            _this.status({});
            executeAction(containerId, file, client, action, options, _this, msg);
        });
        function executeAction(containerId, file, client, action, options, node, msg) {
            var engine = client;
            switch (action) {
                case 'auth':
                    engine.checkAuth(options)
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: ' remove' });
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
                case 'info':
                    engine.info()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: ' remove' });
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
                case 'version':
                    engine.version()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: 'Engine started' });
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
                case 'ping':
                    engine.ping()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: ' remove' });
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
                case 'df':
                    engine.df()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: ' remove' });
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
                case 'import-image':
                    engine.importImage(options, file)
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: ' remove' });
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
                /*                    case 'run':
                                        engine.run()
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
                */
                case 'build':
                    engine.buildImage(options)
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: ' stopped' });
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
                case 'exec-start':
                    engine.getExec(containerId).start(options)
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: ' remove' });
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
                case 'exec-resize':
                    engine.getExec(containerId).start(options)
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: containerId + ' remove' });
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
                case 'exec-json':
                    engine.getExec(containerId).inspect()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: containerId + ' remove' });
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
    RED.nodes.registerType('docker-engine-actions', DockerEngineAction);
};
