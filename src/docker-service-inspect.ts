import { Red, Node } from 'node-red';
import { DockerConfig } from './docker-config';
import * as Dockerode from 'dockerode';



module.exports = function (RED: Red) {
    function DockerServiceInspect(n: any) {
        RED.nodes.createNode(this, n);
        let config = RED.nodes.getNode(n.config) as unknown as DockerConfig;
        let client = config.getClient();

        this.on('input', (msg) => {

            let sid: string = n.service || msg.service || undefined;
           

            if (sid === undefined) {
                this.error("Service id/name must be provided via configuration or via `msg.Service`");
                return;
            }
            this.status({});
            executeAction(sid, client, this,msg);
        });

        function executeAction(sid: string, client: Dockerode, node: Node,msg) {

            let service = client.getService(sid);

            service.inspect().then((data:any) => {  
                let inspect = msg; 
                if(data){
                    inspect = Object.assign(inspect,{ payload: data });
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

    RED.nodes.registerType('docker-service-inspect', DockerServiceInspect);
}

