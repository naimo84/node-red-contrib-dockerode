import { Red, Node } from 'node-red';
import { DockerConfiguration } from './docker-configuration';
import * as Dockerode from 'dockerode';

module.exports = function (RED: Red) {
    function DockerContainterInspect(n: any) {
        RED.nodes.createNode(this, n);
        let config = RED.nodes.getNode(n.config) as unknown as DockerConfiguration;
        let client = config.getClient();

        this.on('input', (msg) => {

            let cid: string = n.container || msg.container || undefined;
           

            if (cid === undefined) {
                this.error("Container id/name must be provided via configuration or via `msg.container`");
                return;
            }
            this.status({});
            executeAction(cid, client, this,msg);
        });

        function executeAction(cid: string, client: Dockerode, node: Node,msg) {

            let container = client.getContainer(cid);

            container.inspect().then((data:any) => {  
                let inspect = msg; 
                if(data){
                    inspect = Object.assign(inspect,{ payload: data });
                }  
                node.send(inspect);
            });
        }
    }

    RED.nodes.registerType('docker-container-inspect', DockerContainterInspect);
}

