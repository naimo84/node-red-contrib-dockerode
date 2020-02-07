import { Red, Node } from 'node-red';
import { DockerConfiguration } from './docker-configuration';
import * as Dockerode from 'dockerode';

module.exports = function (RED: Red) {
 

    function DockerImageAction(n: any) {
        RED.nodes.createNode(this, n);
        let config = RED.nodes.getNode(n.config) as unknown as DockerConfiguration;
        let client = config.getClient();
        this.on('input', (msg) => {

            let imageId: string = n.image || msg.payload.imageId || msg.imageId || undefined;
            let action = n.action || msg.action || msg.payload.action || undefined;
            let options = {};


            if (imageId === undefined && !['list', 'prune', 'create'].includes(action)) {
                this.error("Image id/name must be provided via configuration or via `msg.image`");
                return;
            }
            this.status({});
            executeAction(imageId, options, client, action, this,msg);
        });

        function executeAction(imageId: string, options: any, client: Dockerode, action: string, node: Node,msg) {

            let image = client.getImage(imageId);

            switch (action) {

                case 'list':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ImagesList
                    client.listImages({ all: true })
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: imageId + ' started' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 400) {
                                node.error(`Bad parameter:  ${err.reason}`);
                                node.send({ payload: err });
                            } else if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Sytem Error:  [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;

                case 'inspect':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ImageInspect
                    image.inspect()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: imageId + ' started' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Sytem Error:  [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;

                case 'create':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ImageCreate
                    client.createImage(options)
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: imageId + ' remove' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Sytem Error:  [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;

                case 'remove':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ImageRemove
                    image.remove()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: imageId + ' remove' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Sytem Error:  [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
                case 'history':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ImageHistory
                    image.history()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: imageId + ' remove' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Sytem Error:  [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
                    case 'tag':
                        // https://docs.docker.com/engine/api/v1.40/#operation/ImageTag
                        let repo = 'bla/bla';
                        let tag = 'Hello';
                        image.tag({"repo": repo, "tag": tag})
                            .then(res => {
                                node.status({ fill: 'green', shape: 'dot', text: imageId + ' remove' });
                                node.send(Object.assign(msg,{ payload: res }));
                            }).catch(err => {
                                if (err.statusCode === 500) {
                                    node.error(`Server Error: [${err.statusCode}] ${err.reason}`);
                                    node.send({ payload: err });
                                } else {
                                    node.error(`Sytem Error:  [${err.statusCode}] ${err.reason}`);
                                    return;
                                }
                            });
                        break;
                    case 'push':
                        // https://docs.docker.com/engine/api/v1.40/#operation/ImagePush
                        image.push()
                            .then(res => {
                                node.status({ fill: 'green', shape: 'dot', text: imageId + ' remove' });
                                node.send(Object.assign(msg,{ payload: res }));
                            }).catch(err => {
                                if (err.statusCode === 500) {
                                    node.error(`Server Error: [${err.statusCode}] ${err.reason}`);
                                    node.send({ payload: err });
                                } else {
                                    node.error(`Sytem Error:  [${err.statusCode}] ${err.reason}`);
                                    return;
                                }
                            });
                        break;
                default:
                    node.error(`Called with an unknown action: ${action}`);
                    return;
            }
        }
    }

    RED.httpAdmin.post("/imageSearch", function (req, res) {
        RED.log.debug("POST /imageSearch");

        const nodeId = req.body.id;
        let config = RED.nodes.getNode(nodeId);

        discoverSonos(config, (images) => {
            RED.log.debug("GET /imageSearch: " + images.length + " found");
            res.json(images);
        });
    });

    function discoverSonos(config, discoveryCallback) {
        let client = config.getClient();
        client.listImages({ all: true })
            .then(images => discoveryCallback(images))
            .catch(err => this.error(err));
    }

    RED.nodes.registerType('docker-image-actions', DockerImageAction);
}

