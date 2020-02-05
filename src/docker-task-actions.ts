import { Red, Node } from 'node-red';
import { DockerConfiguration } from './docker-configuration';
import * as Dockerode from 'dockerode';

module.exports = function (RED: Red) {
 
    function DockerTaskAction(n: any) {
        RED.nodes.createNode(this, n);
        let config = RED.nodes.getNode(n.config) as unknown as DockerConfiguration;
        let client = config.getClient();
        this.on('input', (msg) => {

            let cid: string = n.container || msg.payload.container || msg.container || undefined;
            let action = n.action || msg.action || msg.payload.action || undefined;


            if (cid === undefined) {
                this.error("Task id/name must be provided via configuration or via `msg.task`");
                return;
            }
            this.status({});
            executeAction(cid, client, action, this,msg);
        });

        function executeAction(cid: string, client: Dockerode, action: string, node: Node,msg) {

            let task = client.getTask(cid);

            switch (action) {
                case 'inspect':
                    task.inspect()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: cid + ' started' });
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

    RED.nodes.registerType('docker-task-actions', DockerTaskAction);
}

