"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function DockerPlugins(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        if (!config) {
            this.status({ fill: "red", shape: "ring", text: "no configuration" });
            return;
        }
        var client = config.getClient();
        this.on('input', function (msg) {
            client.listPlugins({ all: true })
                .then(function (plugins) {
                _this.send(Object.assign(msg, { payload: plugins }));
            })
                .catch(function (err) {
                _this.send({ payload: {} });
                _this.error(err);
            });
        });
    }
    RED.httpAdmin.post("/pluginSearch", function (req, res) {
        RED.log.debug("POST /pluginSearch");
        var nodeId = req.body.id;
        var config = RED.nodes.getNode(nodeId);
        discoverSonos(config, function (plugins) {
            RED.log.debug("GET /pluginSearch: " + plugins.length + " found");
            res.json(plugins);
        });
    });
    function discoverSonos(config, discoveryCallback) {
        var _this = this;
        var client = config.getClient();
        client.listPlugins({ all: true })
            .then(function (plugins) { return discoveryCallback(plugins); })
            .catch(function (err) { return _this.error(err); });
    }
    RED.nodes.registerType('docker-plugins', DockerPlugins);
};
