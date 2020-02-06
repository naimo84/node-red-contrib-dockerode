import { Red, Node } from 'node-red';
import { DockerConfiguration } from './docker-configuration';
import * as Dockerode from 'dockerode';

module.exports = function (RED: Red) {
 
    function DockerTaskAction(n: any) {
        RED.nodes.createNode(this, n);
        let config = RED.nodes.getNode(n.config) as unknown as DockerConfiguration;
        let client = config.getClient();
        this.on('input', (msg) => {

            let taskId: string = n.taskId || msg.payload.taskId || msg.taskId || undefined;
            let action = n.action || msg.action || msg.payload.action || undefined;


            if (taskId === undefined && !['list'].includes(action)) {
                this.error("Task id/name must be provided via configuration or via `msg.task`");
                return;
            }
            this.status({});
            executeAction(taskId, client, action, this,msg);
        });

        function executeAction(taskId: string, client: Dockerode, action: string, node: Node,msg) {

            let task = client.getTask(taskId);

            switch (action) {

                case 'list':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ServiceList
                    client.listTasks({ all: true })
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: taskId + ' started' });
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
                    task.inspect()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: taskId + ' started' });
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

