"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function DockerVolumeAction(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        var client = config.getClient();
        this.on('input', function (msg) {
            var volumeId = n.volumeId || msg.payload.volumeId || msg.volumeId || undefined;
            var action = n.action || msg.action || msg.payload.action || undefined;
            if (volumeId === undefined && !['list'].includes(action)) {
                _this.error("Volume id/name must be provided via configuration or via `msg.volume`");
                return;
            }
            _this.status({});
            executeAction(volumeId, client, action, _this, msg);
        });
        function executeAction(volumeId, client, action, node, msg) {
            var volume = client.getVolume(volumeId);
            switch (action) {
                case 'list':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ImagesList
                    client.listVolumes({ all: true })
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: volumeId + ' started' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 400) {
                            node.error("Bad parameter:  " + err.reason);
                            node.send({ payload: err });
                        }
                        else if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'inspect':
                    volume.inspect()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: volumeId + ' started' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'remove':
                    volume.remove()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: volumeId + ' stopped' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                default:
                    node.error("Called with an unknown action: " + action);
                    return;
            }
        }
    }
    RED.nodes.registerType('docker-volume-actions', DockerVolumeAction);
};
