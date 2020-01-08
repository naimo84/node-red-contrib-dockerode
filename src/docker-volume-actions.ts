import { Red, Node } from 'node-red';
import { DockerConfiguration } from './docker-configuration';
import * as Dockerode from 'dockerode';

module.exports = function (RED: Red) {
 

    function DockerVolumeAction(n: any) {
        RED.nodes.createNode(this, n);
        let config = RED.nodes.getNode(n.config) as unknown as DockerConfiguration;
        let client = config.getClient();
        this.on('input', (msg) => {

            let cid: string = n.volume || msg.volume || undefined;
            let action = n.action || msg.action || msg.payload || undefined;
            let cmd = n.cmd || msg.cmd|| msg.command || undefined;

            if (cid === undefined) {
                this.error("Volume id/name must be provided via configuration or via `msg.volume`");
                return;
            }
            this.status({});
            executeAction(cid, client, action, cmd, this,msg);
        });

        function executeAction(cid: string, client: Dockerode, action: string, cmd: any, node: Node,msg) {
            let volume = client.getVolume(cid);
            console.log(cmd);

            switch (action) {
                case 'inspect':
                    volume.inspect()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: cid + ' started' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 304) {
                                node.warn(`Unable to start volume "${cid}", volume is already started.`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error starting volume:  [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
                case 'remove':
                    volume.remove()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: cid + ' stopped' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 304) {
                                node.warn(`Unable to stop volume "${cid}", volume is already stopped.`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error stopping volume: [${err.statusCode}] ${err.reason}`);
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

