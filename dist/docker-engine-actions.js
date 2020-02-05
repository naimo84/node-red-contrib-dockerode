"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function DockerEngineAction(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        var client = config.getClient();
        this.on('input', function (msg) {
            var cid = n.container || msg.payload.container || msg.container || undefined;
            var action = n.action || msg.action || msg.payload.action || undefined;
            var cmd = n.cmd || msg.cmd || msg.command || msg.payload.command || undefined;
            var file = n.cmd || msg.cmd || msg.command || undefined;
            _this.status({});
            executeAction(cid, file, client, action, cmd, _this, msg);
        });
        function executeAction(cid, file, client, action, cmd, node, msg) {
            var engine = client;
            switch (action) {
                case 'auth':
                    engine.checkAuth(cmd)
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
                    engine.importImage(cmd, file)
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
                    engine.buildImage(cmd)
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
                    engine.getExec(cid).start(cmd)
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
                    engine.getExec(cid).start(cmd)
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
                case 'exec-json':
                    engine.getExec(cid).inspect()
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
    RED.nodes.registerType('docker-engine-actions', DockerEngineAction);
};
