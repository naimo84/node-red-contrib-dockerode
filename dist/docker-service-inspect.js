"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function DockerServiceInspect(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        var client = config.getClient();
        this.on('input', function (msg) {
            var sid = n.service || msg.service || undefined;
            if (sid === undefined) {
                _this.error("Service id/name must be provided via configuration or via `msg.Service`");
                return;
            }
            _this.status({});
            executeAction(sid, client, _this, msg);
        });
        function executeAction(sid, client, node, msg) {
            var service = client.getService(sid);
            service.inspect().then(function (data) {
                var inspect = msg;
                if (data) {
                    inspect = Object.assign(inspect, { payload: data });
                }
                /*
                                if(data.State.Health){
                                    Object.assign(inspect,{
                                        health: data.State.Health.Status
                                    })
                                }
                */
                node.send(inspect);
            });
        }
    }
    RED.nodes.registerType('docker-service-inspect', DockerServiceInspect);
};
