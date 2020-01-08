import { Red, Node } from 'node-red';
import { DockerConfiguration } from './docker-configuration';
import * as Dockerode from 'dockerode';

module.exports = function (RED: Red) {
 

    function DockerNodeAction(n: any) {
        RED.nodes.createNode(this, n);
        let config = RED.nodes.getNode(n.config) as unknown as DockerConfiguration;
        let client = config.getClient();
        this.on('input', (msg) => {

            let cid: string = n.node || msg.node || undefined;
            let action = n.action || msg.action || msg.payload || undefined;
            let cmd = n.cmd || msg.cmd|| msg.command || undefined;

            if (cid === undefined) {
                this.error("Node id/name must be provided via configuration or via `msg.node`");
                return;
            }
            this.status({});
            executeAction(cid, client, action, cmd, this,msg);
        });

        function executeAction(cid: string, client: Dockerode, action: string, cmd: any, node: Node,msg) {
console.log(cmd);
            let nodeClient = client.getNode(cid);
/*
            node.inspect(options)
            node.rename(options)
            node.update(options)
            node.top(options)
            node.changes()
            node.export()
            node.start(options)
            node.stop(options)
            node.pause(options)
            node.unpause(options)
            node.exec(options)
            node.commit(options)
            node.restart(options)
            node.kill(options)
            node.resize(options)
            node.attach(options)
            node.wait(options)
            node.remove(options)
            node.getArchive(options)
            node.infoArchive(options)
            node.putArchive(file, options)
            node.logs(options)
            node.stats(options)
*/

            switch (action) {
                case 'inspect':
                    nodeClient.inspect()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: cid + ' started' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 304) {
                                node.warn(`Unable to start node "${cid}", node is already started.`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error starting node:  [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
                case 'remove':
                    nodeClient.remove()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: cid + ' stopped' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 304) {
                                node.warn(`Unable to stop node "${cid}", node is already stopped.`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error stopping node: [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
                case 'update':
                    nodeClient.update()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: cid + ' restarted' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 304) {
                                node.warn(`Unable to restart node "${cid}".`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error restarting node: [${err.statusCode}] ${err.reason}`);
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

    RED.nodes.registerType('docker-node-actions', DockerNodeAction);
}

