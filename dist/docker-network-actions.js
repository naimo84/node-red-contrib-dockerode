"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function DockerNetworkAction(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        var client = config.getClient();
        this.on('input', function (msg) {
            var networkId = n.network || msg.payload.networkId || msg.networkId || undefined;
            var action = n.action || msg.action || msg.payload.action || undefined;
            var options = n.options || msg.options || msg.payload.options || undefined;
            if (networkId === undefined && !['list', 'prune', 'create'].includes(action)) {
                _this.error("Network id/name must be provided via configuration or via `msg.network`");
                return;
            }
            _this.status({});
            executeAction(networkId, options, client, action, _this, msg);
        });
        function executeAction(networkId, options, client, action, node, msg) {
            var network = client.getNetwork(networkId);
            switch (action) {
                case 'list':
                    // https://docs.docker.com/engine/api/v1.40/#operation/NetworkList
                    client.listNetworks({ all: true })
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: networkId + ' started' });
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
                    // https://docs.docker.com/engine/api/v1.40/#operation/NetworkInspect
                    network.inspect()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: networkId + ' started' });
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
                    // https://docs.docker.com/engine/api/v1.40/#operation/NetworkRemove
                    network.remove()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: networkId + ' remove' });
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
                case 'connect':
                    // https://docs.docker.com/engine/api/v1.40/#operation/NetworkConnect
                    network.connect()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: networkId + ' remove' });
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
                case 'disconnect':
                    // https://docs.docker.com/engine/api/v1.40/#operation/NetworkDisconnect
                    network.disconnect()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: networkId + ' remove' });
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
                case 'prune':
                    // https://docs.docker.com/engine/api/v1.40/#operation/NetworkPrune
                    client.pruneImages()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: networkId + ' remove' });
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
                    // https://docs.docker.com/engine/api/v1.40/#operation/NetworkCreate
                    client.createNetwork(options)
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: networkId + ' remove' });
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
    RED.httpAdmin.post("/networkSearch", function (req, res) {
        RED.log.debug("POST /networkSearch");
        var nodeId = req.body.id;
        var config = RED.nodes.getNode(nodeId);
        discoverSonos(config, function (networks) {
            RED.log.debug("GET /networkSearch: " + networks.length + " found");
            res.json(networks);
        });
    });
    function discoverSonos(config, discoveryCallback) {
        var _this = this;
        var client = config.getClient();
        client.listNetworks({ all: true })
            .then(function (networks) { return discoveryCallback(networks); })
            .catch(function (err) { return _this.error(err); });
    }
    RED.nodes.registerType('docker-network-actions', DockerNetworkAction);
};
