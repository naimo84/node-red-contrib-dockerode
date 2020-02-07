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
            var options = n.options || msg.options || msg.payload.options || undefined;
            if (volumeId === undefined && !['list', 'prune', 'create'].includes(action)) {
                _this.error("Volume id/name must be provided via configuration or via `msg.volume`");
                return;
            }
            _this.status({});
            executeAction(volumeId, options, client, action, _this, msg);
        });
        function executeAction(volumeId, options, client, action, node, msg) {
            var volume = client.getVolume(volumeId);
            switch (action) {
                case 'list':
                    // https://docs.docker.com/engine/api/v1.40/#operation/VolumeList
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
                    // https://docs.docker.com/engine/api/v1.40/#operation/VolumeInspect
                    volume.inspect()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: volumeId + ' started' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        //                            404 No such volume
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
                    // https://docs.docker.com/engine/api/v1.40/#operation/VolumeDelete
                    volume.remove()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: volumeId + ' stopped' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 404) {
                            node.error("No such volume or volume driver");
                            node.send({ payload: err });
                        }
                        else if (err.statusCode === 409) {
                            node.error("Volume is in use and cannot be removed");
                            node.send({ payload: err });
                        }
                        else if (err.statusCode === 500) {
                            node.error("Server error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'create':
                    // https://docs.docker.com/engine/api/v1.40/#operation/VolumeCreate
                    console.log(options);
                    break;
                case 'prune':
                    // https://docs.docker.com/engine/api/v1.40/#operation/VolumePrune         
                    client.pruneVolumes()
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
    RED.httpAdmin.post("/volumeSearch", function (req, res) {
        RED.log.debug("POST /volumeSearch");
        var nodeId = req.body.id;
        var config = RED.nodes.getNode(nodeId);
        discoverSonos(config, function (volumes) {
            RED.log.debug("GET /volumeSearch: " + volumes.length + " found");
            res.json(volumes);
        });
    });
    function discoverSonos(config, discoveryCallback) {
        var _this = this;
        var client = config.getClient();
        client.listVolumes({ all: true })
            //            .then(volumes => console.log(volumes))
            .then(function (volumes) { return discoveryCallback(volumes); })
            .catch(function (err) { return _this.error(err); });
    }
    RED.nodes.registerType('docker-volume-actions', DockerVolumeAction);
};
