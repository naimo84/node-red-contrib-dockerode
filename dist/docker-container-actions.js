"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    'use strict';
    function DockerContainerAction(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        this.config = RED.nodes.getNode(n.config);
        this.config.action = n.action || undefined;
        this.config.container = n.container;
        this.on('input', function (msg) {
            var client = _this.config.getClient();
            var cid = _this.config.container || msg.container || undefined;
            var action = _this.config.action || msg.payload || undefined;
            if (cid === undefined) {
                _this.error("Container id/name must be provided via configuration or via `msg.container`");
                return;
            }
            var container = client.getContainer(cid);
            switch (action) {
                case 'start':
                    _this.status({ fill: 'green', shape: 'dot', text: cid + ' started' });
                    container.start()
                        .then(function (res) {
                        delete msg.container;
                        delete msg.payload;
                        msg.payload = res;
                        _this.send(msg);
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            _this.warn("Unable to start container \"" + cid + "\", container is already started.");
                            _this.send(msg);
                        }
                        else {
                            _this.error("Error starting container:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'stop':
                    _this.status({ fill: 'green', shape: 'dot', text: cid + ' stopped' });
                    container.stop()
                        .then(function (res) {
                        delete msg.container;
                        delete msg.payload;
                        msg.payload = res;
                        _this.send(msg);
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            _this.warn("Unable to stop container \"" + cid + "\", container is already stopped.");
                            _this.send(msg);
                        }
                        else {
                            _this.error("Error stopping container: [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                default:
                    _this.error("Called with an unknown action: " + action);
                    return;
            }
        });
    }
    RED.nodes.registerType('docker-container-actions', DockerContainerAction);
};
