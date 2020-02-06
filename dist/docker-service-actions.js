"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function DockerServiceAction(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        var client = config.getClient();
        this.on('input', function (msg) {
            var serviceId = n.serviceId || msg.payload.serviceId || msg.serviceId || undefined;
            if (serviceId === undefined) {
                serviceId = n.serviceName || msg.payload.serviceName || msg.serviceName || undefined;
            }
            var action = n.action || msg.action || msg.payload.action || undefined;
            if (serviceId === undefined && !['list'].includes(action)) {
                _this.error("Service id/name must be provided via configuration or via `msg.service`");
                return;
            }
            var cmd = n.cmd || msg.cmd || msg.command || msg.payload.command || undefined;
            _this.status({});
            executeAction(serviceId, client, action, cmd, _this, msg);
        });
        function executeAction(serviceId, client, action, cmd, node, msg) {
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
                case 'inspect':
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
                    service.update(cmd)
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
    RED.nodes.registerType('docker-service-actions', DockerServiceAction);
};
