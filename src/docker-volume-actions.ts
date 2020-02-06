import { Red, Node } from 'node-red';
import { DockerConfiguration } from './docker-configuration';
import * as Dockerode from 'dockerode';

module.exports = function (RED: Red) {

    function DockerVolumeAction(n: any) {
        RED.nodes.createNode(this, n);
        let config = RED.nodes.getNode(n.config) as unknown as DockerConfiguration;
        let client = config.getClient();
        this.on('input', (msg) => {

            let volumeId: string = n.volumeId || msg.payload.volumeId || msg.volumeId || undefined;
            let action = n.action || msg.action || msg.payload.action || undefined;

            if (volumeId === undefined && !['list'].includes(action)) {
                this.error("Volume id/name must be provided via configuration or via `msg.volume`");
                return;
            }
            this.status({});
            executeAction(volumeId, client, action, this,msg);
        });

        function executeAction(volumeId: string, client: Dockerode, action: string, node: Node,msg) {

            let volume = client.getVolume(volumeId);

            switch (action) {

                case 'list':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ImagesList
                    client.listVolumes({ all: true })
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: volumeId + ' started' });
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
                    volume.inspect()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: volumeId + ' started' });
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
                    volume.remove()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: volumeId + ' stopped' });
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

    RED.nodes.registerType('docker-volume-actions', DockerVolumeAction);
}

