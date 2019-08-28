"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    'use strict';
    function DockerImages(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        var client = config.getClient();
        this.on('input', function () {
            client.listImages()
                .then(function (images) { return _this.send({ payload: images }); })
                .catch(function (err) { return _this.error(err); });
        });
    }
    RED.nodes.registerType('docker-images', DockerImages);
};
