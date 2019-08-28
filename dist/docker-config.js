"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Dockerode = require("dockerode");
module.exports = function (RED) {
    'use strict';
    function DockerConfig(n) {
        RED.nodes.createNode(this, n);
        var node = this;
        node.host = n.host;
        node.port = n.port;
        node.getClient = function () {
            return new Dockerode({
                host: node.host,
                port: node.port
            });
        };
    }
    RED.nodes.registerType("docker-config", DockerConfig);
};
