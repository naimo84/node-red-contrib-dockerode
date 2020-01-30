"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function DockerImages(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        if (!config) {
            this.status({ fill: "red", shape: "ring", text: "no configuration" });
            return;
        }
        var client = config.getClient();
        this.on('input', function (msg) {
            client.listImages({ all: false })
                .then(function (images) {
                _this.send(Object.assign(msg, { payload: images }));
            })
                .catch(function (err) {
                _this.send({ payload: {} });
                _this.error(err);
            });
        });
    }
    RED.httpAdmin.post("/imageSearch", function (req, res) {
        RED.log.debug("POST /imageSearch");
        var nodeId = req.body.id;
        var config = RED.nodes.getNode(nodeId);
        discoverSonos(config, function (images) {
            RED.log.debug("GET /imageSearch: " + images.length + " found");
            res.json(images);
        });
    });
    function discoverSonos(config, discoveryCallback) {
        var _this = this;
        var client = config.getClient();
        client.listImages({ all: false })
            //            .then(images => console.log(images))
            .then(function (images) { return discoveryCallback(images); })
            .catch(function (err) { return _this.error(err); });
    }
    RED.nodes.registerType('docker-images', DockerImages);
};
