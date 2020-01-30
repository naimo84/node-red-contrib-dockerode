"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function DockerNetworkAction(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        var client = config.getClient();
        this.on('input', function (msg) {
            var cid = n.network || msg.network || undefined;
            var action = n.action || msg.action || msg.payload || undefined;
            var cmd = n.cmd || msg.cmd || msg.command || undefined;
            if (cid === undefined) {
                _this.error("Network id/name must be provided via configuration or via `msg.network`");
                return;
            }
            _this.status({});
            executeAction(cid, client, action, cmd, _this, msg);
        });
        function executeAction(cid, client, action, cmd, node, msg) {
            console.log(cmd);
            var network = client.getNetwork(cid);
            switch (action) {
                case 'inspect':
                    network.inspect()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' started' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to start network \"" + cid + "\", network is already started.");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error starting network:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'remove':
                    network.remove()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to stop network \"" + cid + "\", network is already removed.");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error removing network: [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'connect':
                    network.connect()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to stop network \"" + cid + "\", network is already removed.");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error removing network: [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'disconnect':
                    network.disconnect()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to stop network \"" + cid + "\", network is already removed.");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error removing network: [" + err.statusCode + "] " + err.reason);
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
    RED.nodes.registerType('docker-network-actions', DockerNetworkAction);
};
