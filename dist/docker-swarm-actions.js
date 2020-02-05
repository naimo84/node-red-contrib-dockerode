"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function DockerSwarmAction(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        var client = config.getClient();
        this.on('input', function (msg) {
            var cid = n.container || msg.payload.container || msg.container || undefined;
            var action = n.action || msg.action || msg.payload.action || undefined;
            var cmd = n.cmd || msg.cmd || msg.command || msg.payload.command || undefined;
            _this.status({});
            executeAction(cid, client, action, cmd, _this, msg);
        });
        function executeAction(cid, client, action, cmd, node, msg) {
            var swarm = client;
            switch (action) {
                case 'inspect':
                    swarm.swarmInspect()
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
                case 'update':
                    swarm.swarmUpdate(cmd)
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' stopped' });
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
                case 'join':
                    swarm.swarmJoin(cmd)
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
                case 'leave':
                    swarm.swarmLeave(cmd)
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
                case 'init':
                    swarm.swarmInit(cmd)
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else if (err.statusCode === 400) {
                            node.warn("Unable to init swarm. Bad payload.");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error init swarm: [" + err.statusCode + "] " + err.reason);
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
    RED.nodes.registerType('docker-swarm-actions', DockerSwarmAction);
};
