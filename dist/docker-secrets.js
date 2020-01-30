"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function DockerSecrets(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        if (!config) {
            this.status({ fill: "red", shape: "ring", text: "no configuration" });
            return;
        }
        var client = config.getClient();
        this.on('input', function (msg) {
            client.listSecrets({ all: false })
                .then(function (secrets) {
                _this.send(Object.assign(msg, { payload: secrets }));
            })
                .catch(function (err) {
                _this.send({ payload: {} });
                _this.error(err);
            });
        });
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
        client.listSecrets({ all: false })
            //            .then(secrets => console.log(secrets))
            .then(function (secrets) { return discoveryCallback(secrets); })
            .catch(function (err) { return _this.error(err); });
    }
    RED.nodes.registerType('docker-secrets', DockerSecrets);
};
