"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function DockerVolumeAction(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        var client = config.getClient();
        this.on('input', function (msg) {
            var cid = n.volume || msg.volume || undefined;
            var action = n.action || msg.action || msg.payload || undefined;
            var cmd = n.cmd || msg.cmd || msg.command || undefined;
            if (cid === undefined) {
                _this.error("Volume id/name must be provided via configuration or via `msg.volume`");
                return;
            }
            _this.status({});
            executeAction(cid, client, action, cmd, _this, msg);
        });
        function executeAction(cid, client, action, cmd, node, msg) {
            var volume = client.getVolume(cid);
            console.log(cmd);
            switch (action) {
                case 'inspect':
                    volume.inspect()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' started' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to start volume \"" + cid + "\", volume is already started.");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error starting volume:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'remove':
                    volume.remove()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' stopped' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to stop volume \"" + cid + "\", volume is already stopped.");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error stopping volume: [" + err.statusCode + "] " + err.reason);
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
