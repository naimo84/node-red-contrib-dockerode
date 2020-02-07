import { Red, Node } from 'node-red';
import { DockerConfiguration } from './docker-configuration';
import * as Dockerode from 'dockerode';

module.exports = function (RED: Red) {
 
    function DockerServiceAction(n: any) {
        RED.nodes.createNode(this, n);
        let config = RED.nodes.getNode(n.config) as unknown as DockerConfiguration;
        let client = config.getClient();
        this.on('input', (msg) => {

            let serviceId: string = n.service || msg.payload.serviceId || msg.serviceId || undefined;
            if(serviceId === undefined){
                serviceId = n.serviceName || msg.payload.serviceName || msg.serviceName || undefined;
            } 
            let action = n.action || msg.action || msg.payload.action || undefined;
            if (serviceId === undefined && !['list', 'prune', 'create'].includes(action)) {
                this.error("Service id/name must be provided via configuration or via `msg.service`");
                return;
            }

            let options = n.options || msg.options || msg.payload.options || undefined;

            this.status({});
            executeAction(serviceId, options, client, action, this,msg);
        });

        function executeAction(serviceId: string, options: any ,client: Dockerode, action: string, node: Node,msg) {

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

                case 'create':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ServiceCreate
                    client.createService(options)
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
                    // https://docs.docker.com/engine/api/v1.40/#operation/ServiceInspect
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
                    // https://docs.docker.com/engine/api/v1.40/#operation/ServiceUpdate
                    service.update(options)
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
                    // https://docs.docker.com/engine/api/v1.40/#operation/ServiceDelete
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
                    // https://docs.docker.com/engine/api/v1.40/#operation/ServiceLogs
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

