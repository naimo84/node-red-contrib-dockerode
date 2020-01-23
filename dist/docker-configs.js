"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function DockerConfigs(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        if (!config) {
            this.status({ fill: "red", shape: "ring", text: "no configuration" });
            return;
        }
        var client = config.getClient();
        this.on('input', function (msg) {
            client.listConfigs({ all: false })
                .then(function (configs) {
                _this.send(Object.assign(msg, { payload: configs }));
            })
                .catch(function (err) {
                _this.send({ payload: {} });
                _this.error(err);
            });
        });
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
        client.listConfigs({ all: false })
            //            .then(configs => console.log(configs))
            .then(function (configs) { return discoveryCallback(configs); })
            .catch(function (err) { return _this.error(err); });
    }
    RED.nodes.registerType('docker-configs', DockerConfigs);
};
