"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function DockerEngineAction(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        var client = config.getClient();
        this.on('input', function (msg) {
            var cid = n.engine || msg.engine || undefined;
            var action = n.action || msg.action || msg.payload || undefined;
            var cmd = n.cmd || msg.cmd || msg.command || undefined;
            var file = n.cmd || msg.cmd || msg.command || undefined;
            _this.status({});
            executeAction(cid, client, action, cmd, file, _this, msg);
        });
        function executeAction(cid, client, action, cmd, file, node, msg) {
            console.log(cmd);
            var engine = client;
            switch (action) {
                case 'version':
                    engine.version()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' started' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to start engine \"" + cid + "\", engine is already started.");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error starting engine:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'info':
                    engine.info()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to init engine \"" + cid + "\", engine is already init.");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error init engine: [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'ping':
                    engine.ping()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to init engine \"" + cid + "\", engine is already init.");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error init engine: [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'df':
                    engine.df()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to init engine \"" + cid + "\", engine is already init.");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error init engine: [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'import-image':
                    engine.importImage(cmd, file)
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to init engine \"" + cid + "\", engine is already init.");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error init engine: [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                /*                    case 'run':
                                        engine.run()
                                            .then(res => {
                                                node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
                                                node.send(Object.assign(msg,{ payload: res }));
                                            }).catch(err => {
                                                if (err.statusCode === 304) {
                                                    node.warn(`Unable to init engine "${cid}", engine is already init.`);
                                                    node.send({ payload: err });
                                                } else {
                                                    node.error(`Error init engine: [${err.statusCode}] ${err.reason}`);
                                                    return;
                                                }
                                            });
                                        break;
                */
                case 'build':
                    engine.buildImage(cmd)
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' stopped' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to stop engine \"" + cid + "\", engine is already stopped.");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error stopping engine: [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'auth':
                    engine.checkAuth(cmd)
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to stop engine \"" + cid + "\", engine is already removed.");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error removing engine: [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'exec-start':
                    engine.getExec(cid).start(cmd)
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to leaving engine \"" + cid + "\", engine is already left.");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error leaving engine: [" + err.statusCode + "] " + err.reason);
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
                        if (err.statusCode === 304) {
                            node.warn("Unable to init engine \"" + cid + "\", engine is already init.");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error init engine: [" + err.statusCode + "] " + err.reason);
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
                        if (err.statusCode === 304) {
                            node.warn("Unable to init engine \"" + cid + "\", engine is already init.");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error init engine: [" + err.statusCode + "] " + err.reason);
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
