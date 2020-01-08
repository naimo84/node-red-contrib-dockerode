import { Red, Node } from 'node-red';
import { DockerConfiguration } from './docker-configuration';
import * as Dockerode from 'dockerode';

module.exports = function (RED: Red) {
    function DockerTaskInspect(n: any) {
        RED.nodes.createNode(this, n);
        let config = RED.nodes.getNode(n.config) as unknown as DockerConfiguration;
        let client = config.getClient();

        this.on('input', (msg) => {

            let tid: string = n.task || msg.task || undefined;
           

            if (tid === undefined) {
                this.error("Task id/name must be provided via configuration or via `msg.Task`");
                return;
            }
            this.status({});
            executeAction(tid, client, this,msg);
        });

        function executeAction(tid: string, client: Dockerode, node: Node,msg) {

            let task = client.getTask(tid);

            task.inspect().then((data:any) => {  
                let inspect = msg; 
                if(data){
                    inspect = Object.assign(inspect,{ payload: data });
                }            
                node.send(inspect);
            });
        }
    }

    RED.nodes.registerType('docker-task-inspect', DockerTaskInspect);
}

