"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function DockerVolumes(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        if (!config) {
            this.status({ fill: "red", shape: "ring", text: "no configuration" });
            return;
        }
        var client = config.getClient();
        this.on('input', function (msg) {
            client.listVolumes({ all: false })
                .then(function (volumes) {
                _this.send(Object.assign(msg, { payload: volumes }));
            })
                .catch(function (err) {
                _this.send({ payload: {} });
                _this.error(err);
            });
        });
    }
    RED.httpAdmin.post("/volumeSearch", function (req, res) {
        RED.log.debug("POST /volumeSearch");
        var nodeId = req.body.id;
        var config = RED.nodes.getNode(nodeId);
        discoverSonos(config, function (volumes) {
            RED.log.debug("GET /volumeSearch: " + volumes.length + " found");
            res.json(volumes);
        });
    });
    function discoverSonos(config, discoveryCallback) {
        var _this = this;
        var client = config.getClient();
        client.listVolumes({ all: false })
            //            .then(volumes => console.log(volumes))
            .then(function (volumes) { return discoveryCallback(volumes); })
            .catch(function (err) { return _this.error(err); });
    }
    RED.nodes.registerType('docker-volumes', DockerVolumes);
};
