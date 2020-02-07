"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function DockerImageAction(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        var client = config.getClient();
        this.on('input', function (msg) {
            var imageId = n.image || msg.payload.imageId || msg.imageId || undefined;
            var action = n.action || msg.action || msg.payload.action || undefined;
            var options = {};
            if (imageId === undefined && !['list', 'prune', 'create'].includes(action)) {
                _this.error("Image id/name must be provided via configuration or via `msg.image`");
                return;
            }
            _this.status({});
            executeAction(imageId, options, client, action, _this, msg);
        });
        function executeAction(imageId, options, client, action, node, msg) {
            var image = client.getImage(imageId);
            switch (action) {
                case 'list':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ImagesList
                    client.listImages({ all: true })
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: imageId + ' started' });
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
                    // https://docs.docker.com/engine/api/v1.40/#operation/ImageInspect
                    image.inspect()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: imageId + ' started' });
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
                case 'create':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ImageCreate
                    client.createImage(options)
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: imageId + ' remove' });
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
                    // https://docs.docker.com/engine/api/v1.40/#operation/ImageRemove
                    image.remove()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: imageId + ' remove' });
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
                case 'history':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ImageHistory
                    image.history()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: imageId + ' remove' });
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
                case 'tag':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ImageTag
                    var repo = 'bla/bla';
                    var tag = 'Hello';
                    image.tag({ "repo": repo, "tag": tag })
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: imageId + ' remove' });
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
                case 'push':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ImagePush
                    image.push()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: imageId + ' remove' });
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
    RED.httpAdmin.post("/imageSearch", function (req, res) {
        RED.log.debug("POST /imageSearch");
        var nodeId = req.body.id;
        var config = RED.nodes.getNode(nodeId);
        discoverSonos(config, function (images) {
            RED.log.debug("GET /imageSearch: " + images.length + " found");
            res.json(images);
        });
    });
    function discoverSonos(config, discoveryCallback) {
        var _this = this;
        var client = config.getClient();
        client.listImages({ all: true })
            .then(function (images) { return discoveryCallback(images); })
            .catch(function (err) { return _this.error(err); });
    }
    RED.nodes.registerType('docker-image-actions', DockerImageAction);
};
