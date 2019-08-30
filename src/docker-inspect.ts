import { Red, Node } from 'node-red';
import { DockerConfig } from './docker-config';
import * as Dockerode from 'dockerode';



module.exports = function (RED: Red) {
    function DockerInspect(n: any) {
        RED.nodes.createNode(this, n);
        let config = RED.nodes.getNode(n.config) as unknown as DockerConfig;
        let client = config.getClient();

        this.on('input', (msg) => {

            let cid: string = n.container || msg.container || undefined;
           

            if (cid === undefined) {
                this.error("Container id/name must be provided via configuration or via `msg.container`");
                return;
            }
            this.status({});
            executeAction(cid, client, this);
        });

        function executeAction(cid: string, client: Dockerode, node: Node) {

            let container = client.getContainer(cid);

            container.inspect().then((data:any) => {  
                let inspect = {}; 
                if(data){
                    inspect = { payload: data };
                }            
                if(data.State.Health){
                    Object.assign(inspect,{
                        health: data.State.Health.Status
                    })
                }

                node.send(inspect);
                
            });
        }
    }

    RED.nodes.registerType('docker-inspect', DockerInspect);
}

