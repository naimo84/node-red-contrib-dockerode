"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function DockerConfigAction(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        var client = config.getClient();
        this.on('input', function (msg) {
            RED.log.debug(msg);
            var configId = n.config || msg.payload.configId || msg.configId || undefined;
            var action = n.action || msg.action || msg.payload.action || undefined;
            var options = n.options || msg.options || msg.payload.options || undefined;
            if (configId === undefined && !['list', 'prune', 'create'].includes(action)) {
                _this.error("Config id/name must be provided via configuration or via `msg.config`");
                return;
            }
            _this.status({});
            executeAction(configId, options, client, action, _this, msg);
        });
        function executeAction(configId, options, client, action, node, msg) {
            var config = client.getConfig(configId);
            switch (action) {
                case 'list':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ConfigList
                    client.listConfigs({ all: true })
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: configId + ' started' });
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
                case 'create':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ConfigCreate
                    client.createConfig(options)
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: configId + ' remove' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else if (err.statusCode === 409) {
                            node.error("Name conflicts with an existing objectd: [" + configId + "]");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'inspect':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ConfigInspect
                    config.inspect()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: configId + ' started' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 503) {
                            node.error("Node is not part of a swarm: [" + configId + "]");
                            node.send({ payload: err });
                        }
                        else if (err.statusCode === 404) {
                            node.error("Config not found: [" + configId + "]");
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
                case 'remove':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ConfigDelete
                    config.remove()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: configId + ' remove' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 503) {
                            node.error("Node is not part of a swarm: [" + configId + "]");
                            node.send({ payload: err });
                        }
                        else if (err.statusCode === 404) {
                            node.error("Config not found: [" + configId + "]");
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
                case 'update':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ConfigUpdate
                    config.update()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: configId + ' remove' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 503) {
                            node.error("Node is not part of a swarm: [" + configId + "]");
                            node.send({ payload: err });
                        }
                        else if (err.statusCode === 400) {
                            node.error("Bad parameter: [" + configId + "]");
                            node.send({ payload: err });
                        }
                        else if (err.statusCode === 404) {
                            node.error("Config not found: [" + configId + "]");
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
                default:
                    node.error("Called with an unknown action: " + action);
                    return;
            }
        }
    }
    RED.httpAdmin.post("/configSearch", function (req, res) {
        RED.log.debug("POST /configSearch");
        var nodeId = req.body.id;
        var config = RED.nodes.getNode(nodeId);
        discoverSonos(config, function (configs) {
            RED.log.debug("GET /configSearch: " + configs.length + " found");
            res.json(configs);
        });
    });
    function discoverSonos(config, discoveryCallback) {
        var _this = this;
        var client = config.getClient();
        client.listConfigs({ all: true })
            .then(function (configs) { return discoveryCallback(configs); })
            .catch(function (err) { return _this.error(err); });
    }
    RED.nodes.registerType('docker-config-actions', DockerConfigAction);
};
