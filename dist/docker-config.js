"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Dockerode = require("dockerode");
module.exports = function (RED) {
    function DockerConfig(n) {
        RED.nodes.createNode(this, n);
        var node = this;
        node.host = n.host;
        node.port = n.port;
        node.options = n.options;
        var dockeropt = {};
        if (node.host.includes("docker.sock")) {
            dockeropt = {
                socketPath: node.host
            };
        }
        else {
            dockeropt = {
                host: node.host,
                port: node.port
            };
        }
        node.getClient = function () {
            return new Dockerode(dockeropt);
        };
    }
    RED.nodes.registerType("docker-config", DockerConfig);
};
