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
                .then(function (containers) { return _this.send({ payload: containers }); })
                .catch(function (err) { return _this.error(err); });
        });
    }
    RED.nodes.registerType('docker-containers', DckerContainers);
};
