"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function DockerSecretAction(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        var client = config.getClient();
        this.on('input', function (msg) {
            var secretId = n.secret || msg.payload.secretId || msg.secretId || undefined;
            //TODO: make this disabled by default
            var action = n.action || msg.action || msg.payload.action || undefined;
            var options = n.options || msg.options || msg.payload.options || undefined;
            if (secretId === undefined && !['list', 'prune', 'create'].includes(action)) {
                _this.error("Secret id/name must be provided via configuration or via `msg.secret`");
                return;
            }
            _this.status({});
            executeAction(secretId, options, client, action, _this, msg);
        });
        function executeAction(secretId, options, client, action, node, msg) {
            var secret = client.getSecret(secretId);
            switch (action) {
                case 'list':
                    // https://docs.docker.com/engine/api/v1.40/#operation/SecretList
                    client.listSecrets({ all: true })
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: secretId + ' started' });
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
                    // https://docs.docker.com/engine/api/v1.40/#operation/SecretInspect
                    secret.inspect()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: secretId + ' started' });
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
                    // https://docs.docker.com/engine/api/v1.40/#operation/SecretDelete
                    secret.remove()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: secretId + ' stopped' });
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
                    // https://docs.docker.com/engine/api/v1.40/#operation/SecretUpdate
                    secret.update()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: secretId + ' restarted' });
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
                    // https://docs.docker.com/engine/api/v1.40/#operation/SecretCreate
                    client.createSecret(options)
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: secretId + ' restarted' });
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
    RED.httpAdmin.post("/secretSearch", function (req, res) {
        RED.log.debug("POST /secretSearch");
        var nodeId = req.body.id;
        var config = RED.nodes.getNode(nodeId);
        discoverSonos(config, function (secrets) {
            RED.log.debug("GET /secretSearch: " + secrets.length + " found");
            res.json(secrets);
        });
    });
    function discoverSonos(config, discoveryCallback) {
        var _this = this;
        var client = config.getClient();
        client.listSecrets({ all: true })
            .then(function (secrets) { return discoveryCallback(secrets); })
            .catch(function (err) { return _this.error(err); });
    }
    RED.nodes.registerType('docker-secret-actions', DockerSecretAction);
};
