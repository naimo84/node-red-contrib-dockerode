"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function DockerServiceAction(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        var client = config.getClient();
        this.on('input', function (msg) {
            var sid = n.service || msg.service || undefined;
            var action = n.action || msg.action || msg.payload || undefined;
            var cmd = n.cmd || msg.cmd || msg.command || undefined;
            if (sid === undefined) {
                _this.error("Service id/name must be provided via configuration or via `msg.service`");
                return;
            }
            _this.status({});
            executeAction(sid, client, action, cmd, _this, msg);
        });
        function executeAction(sid, client, action, cmd, node, msg) {
            console.log(cmd);
            var service = client.getService(sid);
            switch (action) {
                case 'inspect':
                    service.inspect()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: sid + ' started' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to start service \"" + sid + "\", service is already started.");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error starting service:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'update':
                    service.update(cmd)
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: sid + ' stopped' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to stop service \"" + sid + "\", service is already stopped.");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error stopping service: [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'remove':
                    service.remove()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: sid + ' remove' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to stop service \"" + sid + "\", service is already removed.");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error removing service: [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                //Todo: tail
                case 'logs':
                    service.logs()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: sid + ' killed' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to kill service \"" + sid + "\".");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error killing service: [" + err.statusCode + "] " + err.reason);
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
