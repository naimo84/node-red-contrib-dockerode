import { Red, Node } from 'node-red';
import { DockerConfiguration } from './docker-configuration';
import * as Dockerode from 'dockerode';

module.exports = function (RED: Red) {
 

    function DockerAction(n: any) {
        RED.nodes.createNode(this, n);
        let config = RED.nodes.getNode(n.config) as unknown as DockerConfiguration;
        let client = config.getClient();
        this.on('input', (msg) => {

            let action = n.action || msg.action || msg.payload || undefined;
            let cmd = n.cmd || msg.cmd|| msg.command || undefined;

            this.status({});
            executeAction(client, action, cmd, this,msg);
        });

        function executeAction(client: Dockerode, action: string, cmd: any, node: Node,msg) {
            console.log(cmd);
            let docker = client;

/*

            
            
            
            
            
            
            getContainer
            getImage
            getVolume
            getPlugin
            getService
            getTask
            getNode
            getNetwork
            getSecret
            getConfig
            getExec



            listContainers
            listImages
            listServices
            listNodes
            listTasks
            listSecrets
            listConfigs
            listPlugins
            listVolumes
            listNetworks


            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            


*/


            switch (action) {
                case 'df':
                    docker.df()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: ' started' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 304) {
                                node.warn(`Unable to start docker is already started.`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error starting docker:  [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
                case 'info':
                    docker.info()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: ' stopped' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 304) {
                                node.warn(`Unable to stop , docker is already stopped.`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error stopping docker: [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
                case 'version':
                    docker.version()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: ' restarted' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 304) {
                                node.warn(`Unable to restart docker`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Error restarting docker: [${err.statusCode}] ${err.reason}`);
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

    RED.nodes.registerType('docker-actions', DockerAction);
}

