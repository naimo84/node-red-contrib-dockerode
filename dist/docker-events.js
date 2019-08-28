"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    'use strict';
    function DockerEvents(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        var client = config.getClient();
        client.getEvents({}, function (err, events) {
            if (err) {
                _this.error('Error during client.getEvents()', err);
                _this.status({ fill: 'red', shape: 'ring', text: 'error' });
                return;
            }
            _this.status({ fill: 'green', shape: 'dot', text: 'node-red:common.status.connected' });
            events.on('data', function (data) {
                var event = {};
                try {
                    event = JSON.parse(data.toString());
                }
                catch (e) {
                    _this.error('Error parsing JSON', e);
                    return;
                }
                _this.send({
                    _msgid: RED.util.generateId(),
                    type: event.Type,
                    action: event.Action,
                    time: event.time,
                    timeNano: event.timeNano,
                    payload: event
                });
            });
            events.on('close', function () {
                _this.status({ fill: 'red', shape: 'ring', text: 'node-red:common.status.disconnected' });
                _this.warn('Docker event stream closed.');
            });
            events.on('error', function (err) {
                _this.status({ fill: 'red', shape: 'ring', text: 'node-red:common.status.disconnected' });
                _this.error('Error:', err);
            });
            events.on('end', function () {
                _this.status({ fill: 'yellow', shape: 'ring', text: 'stream ended' });
                _this.warn('Docker event stream ended.');
            });
        });
    }
    RED.nodes.registerType('docker-events', DockerEvents);
};
