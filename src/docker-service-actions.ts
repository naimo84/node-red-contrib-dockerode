import { Red, Node } from 'node-red';
import { DockerConfiguration } from './docker-configuration';
import * as Dockerode from 'dockerode';

module.exports = function (RED: Red) {
 
    function DockerServiceAction(n: any) {
        RED.nodes.createNode(this, n);
        let config = RED.nodes.getNode(n.config) as unknown as DockerConfiguration;
        let client = config.getClient();
        this.on('input', (msg) => {

            let serviceId: string = n.serviceId || msg.payload.serviceId || msg.serviceId || undefined;
            if(serviceId === undefined){
                serviceId = n.serviceName || msg.payload.serviceName || msg.serviceName || undefined;
            } 
            let action = n.action || msg.action || msg.payload.action || undefined;
            if (serviceId === undefined && !['list'].includes(action)) {
                this.error("Service id/name must be provided via configuration or via `msg.service`");
                return;
            }

            let cmd = n.cmd || msg.cmd|| msg.command || msg.payload.command || undefined;

            this.status({});
            executeAction(serviceId, client, action, cmd, this,msg);
        });

        function executeAction(serviceId: string, client: Dockerode, action: string, cmd: any, node: Node,msg) {

            let service = client.getService(serviceId);

            switch (action) {

                case 'list':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ServiceList
                    client.listServices({ all: true })
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: serviceId + ' started' });
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
                    service.inspect()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: 'Inspected: ' + serviceId });
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
                    
               case 'update':
                    service.update(cmd)
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: 'Updated: ' + serviceId });
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

                case 'remove':
                    service.remove()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: 'Update: ' + serviceId });
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
//Todo: tail
                case 'logs':
                    service.logs()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: 'Logging: ' + serviceId });
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

    RED.httpAdmin.post("/serviceSearch", function (req, res) {
        RED.log.debug("POST /serviceSearch");

        const nodeId = req.body.id;
        let config = RED.nodes.getNode(nodeId);

        discoverSonos(config, (services) => {
            RED.log.debug("GET /serviceSearch: " + services.length + " found");
            res.json(services);
        });
    });

    function discoverSonos(config, discoveryCallback) {
        let client = config.getClient();
        client.listServices({ all: true })
            .then(services => discoveryCallback(services))
            .catch(err => this.error(err));
    }
    
    RED.nodes.registerType('docker-service-actions', DockerServiceAction);
}

