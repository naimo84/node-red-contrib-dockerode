"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function DockerNodeAction(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        var client = config.getClient();
        this.on('input', function (msg) {
            var nodeId = n.nodeId || msg.payload.nodeId || msg.nodeId || undefined;
            var action = n.action || msg.action || msg.payload.action || undefined;
            if (nodeId === undefined && !['list'].includes(action)) {
                _this.error("Node id/name must be provided via configuration or via `msg.node`");
                return;
            }
            _this.status({});
            executeAction(nodeId, client, action, _this, msg);
        });
        function executeAction(nodeId, client, action, node, msg) {
            var nodeClient = client.getNode(nodeId);
            switch (action) {
                case 'list':
                    // https://docs.docker.com/engine/api/v1.40/#operation/NodeList
                    client.listNetworks({ all: true })
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: nodeId + ' started' });
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
                    nodeClient.inspect()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: nodeId + ' started' });
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
                    nodeClient.remove()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: nodeId + ' stopped' });
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
                    nodeClient.update()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: nodeId + ' restarted' });
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
    RED.httpAdmin.post("/nodeSearch", function (req, res) {
        RED.log.debug("POST /nodeSearch");
        var nodeId = req.body.id;
        var config = RED.nodes.getNode(nodeId);
        discoverSonos(config, function (nodes) {
            RED.log.debug("GET /nodeSearch: " + nodes.length + " found");
            res.json(nodes);
        });
    });
    function discoverSonos(config, discoveryCallback) {
        var _this = this;
        var client = config.getClient();
        client.listNodes({ all: true })
            .then(function (nodes) { return discoveryCallback(nodes); })
            .catch(function (err) { return _this.error(err); });
    }
    RED.nodes.registerType('docker-node-actions', DockerNodeAction);
};
