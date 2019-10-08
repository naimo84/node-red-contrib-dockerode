"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function DockerInspect(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        var client = config.getClient();
        this.on('input', function (msg) {
            var cid = n.container || msg.container || undefined;
            if (cid === undefined) {
                _this.error("Container id/name must be provided via configuration or via `msg.container`");
                return;
            }
            _this.status({});
            executeAction(cid, client, _this, msg);
        });
        function executeAction(cid, client, node, msg) {
            var container = client.getContainer(cid);
            container.inspect().then(function (data) {
                var inspect = msg;
                if (data) {
                    inspect = Object.assign(inspect, { payload: data });
                }
                if (data.State.Health) {
                    Object.assign(inspect, {
                        health: data.State.Health.Status
                    });
                }
                node.send(inspect);
            });
        }
    }
    RED.nodes.registerType('docker-inspect', DockerInspect);
};
