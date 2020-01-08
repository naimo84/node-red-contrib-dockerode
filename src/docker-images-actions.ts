import { Red, Node } from 'node-red';
import { DockerConfiguration } from './docker-configuration';
import * as Dockerode from 'dockerode';

module.exports = function (RED: Red) {
 

    function DockerImageAction(n: any) {
        RED.nodes.createNode(this, n);
        let config = RED.nodes.getNode(n.config) as unknown as DockerConfiguration;
        let client = config.getClient();
        this.on('input', (msg) => {

            let cid: string = n.image || msg.image || undefined;
            let action = n.action || msg.action || msg.payload || undefined;
            let cmd = n.cmd || msg.cmd|| msg.command || undefined;

            if (cid === undefined) {
                this.error("Image id/name must be provided via configuration or via `msg.image`");
                return;
            }
            this.status({});
            executeAction(cid, client, action, cmd, this,msg);
        });

        function executeAction(cid: string, client: Dockerode, action: string, cmd: any, node: Node,msg) {
console.log(cmd);
            let image = client.getImage(cid);

            switch (action) {
                case 'inspect':
                    image.inspect()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: cid + ' started' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 304) {
                                node.warn(`Unable to start image "${cid}", image is already started.`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error starting image:  [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
                case 'remove':
                    image.remove()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 304) {
                                node.warn(`Unable to stop image "${cid}", image is already removed.`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error removing image: [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
                case 'history':
                    image.history()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 304) {
                                node.warn(`Unable to stop image "${cid}", image is already removed.`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error removing image: [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
                    case 'tag':
                        image.tag()
                            .then(res => {
                                node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
                                node.send(Object.assign(msg,{ payload: res }));
                            }).catch(err => {
                                if (err.statusCode === 304) {
                                    node.warn(`Unable to stop image "${cid}", image is already removed.`);
                                    node.send({ payload: err });
                                } else {
                                    node.error(`Error removing image: [${err.statusCode}] ${err.reason}`);
                                    return;
                                }
                            });
                        break;
                    case 'push':
                        image.push()
                            .then(res => {
                                node.status({ fill: 'green', shape: 'dot', text: cid + ' remove' });
                                node.send(Object.assign(msg,{ payload: res }));
                            }).catch(err => {
                                if (err.statusCode === 304) {
                                    node.warn(`Unable to stop image "${cid}", image is already removed.`);
                                    node.send({ payload: err });
                                } else {
                                    node.error(`Error removing image: [${err.statusCode}] ${err.reason}`);
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

    RED.nodes.registerType('docker-image-actions', DockerImageAction);
}

