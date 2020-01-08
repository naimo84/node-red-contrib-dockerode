import { Red, Node } from 'node-red';
import { DockerConfiguration } from './docker-configuration';
import * as Dockerode from 'dockerode';

module.exports = function (RED: Red) {
    function DockerNodeInspect(n: any) {
        RED.nodes.createNode(this, n);
        let config = RED.nodes.getNode(n.config) as unknown as DockerConfiguration;
        let client = config.getClient();

        this.on('input', (msg) => {

            let nid: string = n.node || msg.node || undefined;
           

            if (nid === undefined) {
                this.error("Node id/name must be provided via configuration or via `msg.Node`");
                return;
            }
            this.status({});
            executeAction(nid, client, this,msg);
        });

        function executeAction(nid: string, client: Dockerode, node: Node,msg) {

            let nodeClient = client.getNode(nid);

            nodeClient.inspect().then((data:any) => {  
                let inspect = msg; 
                if(data){
                    inspect = Object.assign(inspect,{ payload: data });
                }            
                node.send(inspect);
            });
        }
    }

    RED.nodes.registerType('docker-node-inspect', DockerNodeInspect);
}

