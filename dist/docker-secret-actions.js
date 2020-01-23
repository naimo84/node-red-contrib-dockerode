"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function DockerSecretAction(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        var client = config.getClient();
        this.on('input', function (msg) {
            var cid = n.secret || msg.secret || undefined;
            var action = n.action || msg.action || msg.payload || undefined;
            var cmd = n.cmd || msg.cmd || msg.command || undefined;
            if (cid === undefined) {
                _this.error("Secret id/name must be provided via configuration or via `msg.secret`");
                return;
            }
            _this.status({});
            executeAction(cid, client, action, cmd, _this, msg);
        });
        function executeAction(cid, client, action, cmd, node, msg) {
            console.log(cmd);
            var secret = client.getSecret(cid);
            switch (action) {
                case 'inspect':
                    secret.inspect()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' started' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to start secret \"" + cid + "\", secret is already started.");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error starting secret:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'remove':
                    secret.remove()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' stopped' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to stop secret \"" + cid + "\", secret is already stopped.");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error stopping secret: [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'update':
                    secret.update()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' restarted' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to restart secret \"" + cid + "\".");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error restarting secret: [" + err.statusCode + "] " + err.reason);
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
    RED.nodes.registerType('docker-secret-actions', DockerSecretAction);
};
