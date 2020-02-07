"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function DockerServiceAction(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        var client = config.getClient();
        this.on('input', function (msg) {
            var serviceId = n.service || msg.payload.serviceId || msg.serviceId || undefined;
            if (serviceId === undefined) {
                serviceId = n.serviceName || msg.payload.serviceName || msg.serviceName || undefined;
            }
            var action = n.action || msg.action || msg.payload.action || undefined;
            if (serviceId === undefined && !['list', 'prune', 'create'].includes(action)) {
                _this.error("Service id/name must be provided via configuration or via `msg.service`");
                return;
            }
            var options = n.options || msg.options || msg.payload.options || undefined;
            _this.status({});
            executeAction(serviceId, options, client, action, _this, msg);
        });
        function executeAction(serviceId, options, client, action, node, msg) {
            var service = client.getService(serviceId);
            switch (action) {
                case 'list':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ServiceList
                    client.listServices({ all: true })
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: serviceId + ' started' });
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
                    // https://docs.docker.com/engine/api/v1.40/#operation/ServiceCreate
                    client.createService(options)
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: serviceId + ' started' });
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
                    // https://docs.docker.com/engine/api/v1.40/#operation/ServiceInspect
                    service.inspect()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: 'Inspected: ' + serviceId });
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
                    // https://docs.docker.com/engine/api/v1.40/#operation/ServiceUpdate
                    service.update(options)
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: 'Updated: ' + serviceId });
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
                    // https://docs.docker.com/engine/api/v1.40/#operation/ServiceDelete
                    service.remove()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: 'Update: ' + serviceId });
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
                //Todo: tail
                case 'logs':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ServiceLogs
                    service.logs()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: 'Logging: ' + serviceId });
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
    RED.httpAdmin.post("/serviceSearch", function (req, res) {
        RED.log.debug("POST /serviceSearch");
        var nodeId = req.body.id;
        var config = RED.nodes.getNode(nodeId);
        discoverSonos(config, function (services) {
            RED.log.debug("GET /serviceSearch: " + services.length + " found");
            res.json(services);
        });
    });
    function discoverSonos(config, discoveryCallback) {
        var _this = this;
        var client = config.getClient();
        client.listServices({ all: true })
            .then(function (services) { return discoveryCallback(services); })
            .catch(function (err) { return _this.error(err); });
    }
    RED.nodes.registerType('docker-service-actions', DockerServiceAction);
};
