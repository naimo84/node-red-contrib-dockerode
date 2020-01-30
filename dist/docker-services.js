"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function DockerServices(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        if (!config) {
            this.status({ fill: "red", shape: "ring", text: "no configuration" });
            return;
        }
        var client = config.getClient();
        this.on('input', function (msg) {
            client.listServices({ all: false })
                .then(function (services) {
                _this.send(Object.assign(msg, { payload: services }));
            })
                .catch(function (err) {
                _this.send({ payload: {} });
                _this.error(err);
            });
        });
    }
    RED.httpAdmin.post("/serviceSearch", function (req, res) {
        RED.log.debug("POST /serviceSearch");
        var nodeId = req.body.id;
        var config = RED.nodes.getNode(nodeId);
        discoverSonos(config, function (services) {
            RED.log.debug("GET /serviceSearch: " + services.length + " found");
            res.json(services);
        });
    });
    function discoverSonos(config, discoveryCallback) {
        var _this = this;
        var client = config.getClient();
        client.listServices({ all: false })
            //            .then(services => console.log(services))
            .then(function (services) { return discoveryCallback(services); })
            .catch(function (err) { return _this.error(err); });
    }
    RED.nodes.registerType('docker-services', DockerServices);
};
