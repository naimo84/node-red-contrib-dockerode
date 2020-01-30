"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function DockerNodes(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        if (!config) {
            this.status({ fill: "red", shape: "ring", text: "no configuration" });
            return;
        }
        var client = config.getClient();
        this.on('input', function (msg) {
            client.listNodes({ all: false })
                .then(function (nodes) {
                _this.send(Object.assign(msg, { payload: nodes }));
            })
                .catch(function (err) {
                _this.send({ payload: {} });
                _this.error(err);
            });
        });
    }
    RED.httpAdmin.post("/nodeSearch", function (req, res) {
        RED.log.debug("POST /nodeSearch");
        var nodeId = req.body.id;
        var config = RED.nodes.getNode(nodeId);
        discoverSonos(config, function (nodes) {
            RED.log.debug("GET /nodeSearch: " + nodes.length + " found");
            res.json(nodes);
        });
    });
    function discoverSonos(config, discoveryCallback) {
        var _this = this;
        var client = config.getClient();
        client.listNodes({ all: false })
            //            .then(nodes => console.log(nodes))
            .then(function (nodes) { return discoveryCallback(nodes); })
            .catch(function (err) { return _this.error(err); });
    }
    RED.nodes.registerType('docker-nodes', DockerNodes);
};
