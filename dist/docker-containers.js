"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    'use strict';
    function DckerContainers(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        var client = config.getClient();
        this.on('input', function () {
            client.listContainers({ all: false })
                .then(function (containers) {
                _this.send({ payload: containers });
            })
                .catch(function (err) {
                _this.send({ payload: {} });
                _this.error(err);
            });
        });
    }
    RED.httpAdmin.post("/containerSearch", function (req, res) {
        RED.log.debug("POST /containerSearch");
        var nodeId = req.body.id;
        var config = RED.nodes.getNode(nodeId);
        discoverSonos(config, function (containers) {
            RED.log.debug("GET /containerSearch: " + containers.length + " found");
            res.json(containers);
        });
    });
    function discoverSonos(config, discoveryCallback) {
        var _this = this;
        var client = config.getClient();
        client.listContainers({ all: false })
            .then(function (containers) { return discoveryCallback(containers); })
            .catch(function (err) { return _this.error(err); });
    }
    RED.nodes.registerType('docker-containers', DckerContainers);
};
