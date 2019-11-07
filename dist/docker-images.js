"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function DockerImages(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        var client = config.getClient();
        this.on('input', function (msg) {
            client.listImages()
                .then(function (images) {
                _this.send(Object.assign(msg, { payload: images }));
            })
                .catch(function (err) { return _this.error(err); });
        });
    }
    RED.nodes.registerType('docker-images', DockerImages);
};
