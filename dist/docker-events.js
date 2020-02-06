"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function DockerEvents(n) {
        var node = this;
        RED.nodes.createNode(node, n);
        var config = RED.nodes.getNode(n.config);
        var client = config.getClient();
        client.getEvents().then(function (events) {
            node.status({ fill: 'green', shape: 'dot', text: 'node-red:common.status.connected' });
            events.on('data', function (data) {
                var event = {};
                try {
                    event = JSON.parse(data.toString());
                }
                catch (e) {
                    node.error('Error parsing JSON', e);
                    return;
                }
                node.send({
                    _msgid: RED.util.generateId(),
                    type: event.Type,
                    action: event.Action,
                    time: event.time,
                    timeNano: event.timeNano,
                    payload: event
                });
            });
            events.on('close', function () {
                node.status({ fill: 'red', shape: 'ring', text: 'node-red:common.status.disconnected' });
                node.warn('Docker event stream closed.');
            });
            events.on('error', function (err) {
                node.status({ fill: 'red', shape: 'ring', text: 'node-red:common.status.disconnected' });
                node.error('Error:', err);
            });
            events.on('end', function () {
                node.status({ fill: 'yellow', shape: 'ring', text: 'stream ended' });
                node.warn('Docker event stream ended.');
            });
        });
    }
    RED.nodes.registerType('docker-events', DockerEvents);
};
