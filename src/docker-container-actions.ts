import { Red, Node } from 'node-red';
import { DockerConfiguration } from './docker-configuration';
import * as Dockerode from 'dockerode';

module.exports = function (RED: Red) {
 

    function DockerContainerAction(n: any) {
        RED.nodes.createNode(this, n);
        let config = RED.nodes.getNode(n.config) as unknown as DockerConfiguration;
        let client = config.getClient();
        this.on('input', (msg) => {

            let action = n.action || msg.action || msg.payload.action || undefined;
            let cmd = n.cmd || msg.cmd|| msg.command || msg.payload.command || undefined;
            let containerId: string = n.containerId || msg.payload.containerId || msg.containerId || n.containerName || msg.payload.containerName || msg.containerName || undefined;
            if (containerId === undefined && !['list'].includes(action)) {
                this.error("Container id/name must be provided via configuration or via `msg.containerId`");
                return;
            }
            this.status({});
            executeAction(containerId, client, action, cmd, this,msg);
        });

        function executeAction(containerId: string, client: Dockerode, action: string, cmd: any, node: Node,msg) {

            let container = client.getContainer(containerId);

            switch (action) {
                case 'list':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerList
                    client.listContainers({ all: true })
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' started' });
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
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerInspect
                    container.inspect()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' started' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`);
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

                case 'top':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerTop
                    container.top()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' killed' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`);
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

                case 'logs':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerLogs
                    container.logs()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' restarted' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`);
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

                case 'changes':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerChanges
                    container.changes()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' started' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`);
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

                case 'export':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerExport
                    container.export()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' started' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`);
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

                case 'stats':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerStats
                    container.stats()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' restarted' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`);
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

                case 'resize':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerResize
                    container.resize()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' started' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`);
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

                case 'start':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerStart
                    container.start()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' started' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`);
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

                case 'stop':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerStop
                    container.stop()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' stopped' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`);
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
                
                case 'restart':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerRestart
                    container.restart()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' restarted' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`);
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

                case 'kill':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerKill
                    container.kill()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' killed' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`);
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

                case 'update':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerUpdate
                    container.update(cmd)
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' started' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`);
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

                case 'rename':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerRename
                    container.rename(cmd)
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' started' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`);
                                node.send({ payload: err });
                            } else if (err.statusCode === 409) {
                                node.error(`Name already in use: [${err.statusCode}] ${err.reason}`);
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

                case 'pause':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerPause
                    container.pause()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' stopped' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`);
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

                case 'unpause':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerUnpause
                    container.unpause()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' stopped' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`);
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
    
                case 'attach':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerAttach
                    container.attach(cmd)
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' started' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`);
                                node.send({ payload: err });
                            } else if (err.statusCode === 400) {
                                node.error(`Bad parameter: [${err.statusCode}] ${err.reason}`);
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
/*
//TODO: not found in dockerode
                    case 'attach-ws':
                        // https://docs.docker.com/engine/api/v1.40/#operation/ContainerAttachWebsocket
                        container.attach-ws()
                            .then(res => {
                                node.status({ fill: 'green', shape: 'dot', text: containerId + ' started' });
                                node.send(Object.assign(msg,{ payload: res }));
                            }).catch(err => {
                                if (err.statusCode === 404) {
                                    node.error(`No such container: [${containerId}]`);
                                    node.send({ payload: err });
                                } else if (err.statusCode === 400) {
                                    node.error(`Bad parameter: [${err.statusCode}] ${err.reason}`);
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
*/                    

                case 'wait':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerWait
                    container.wait()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' killed' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`);
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

                case 'remove':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerDelete
                    container.remove()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' killed' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`);
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

                case 'archive-info':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerArchiveInfo
                    container.infoArchive(cmd)
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' killed' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 404) {
                                node.error(`Container or path does not exist: [${containerId}]`);
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

                case 'get-archive':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerArchive
                    container.getArchive(cmd)
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' killed' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 404) {
                                node.error(`Container or path does not exist: [${containerId}]`);
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

/*
//TODO: fix file option
                case 'putArchive':
                    // https://docs.docker.com/engine/api/v1.40/#operation/PutContainerArchive
                    container.putArchive(file, options)
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' killed' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 404) {
                                node.error(`No such container or path does not exist inside the container: [${containerId}]`);
                                node.send({ payload: err });
                            } else if (err.statusCode === 400) {
                                node.error(`Bad parameter: [${err.statusCode}] ${err.reason}`);
                                node.send({ payload: err });
                            } else if (err.statusCode === 403) {
                                node.error(` Permission denied, the volume or container rootfs is marked as read-only.: [${err.statusCode}] ${err.reason}`);
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
*/
/*
//TODO: not found in dockerode
                case 'prune':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerPrune
                    container.prune()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' started' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`);
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
*/
            }
        }
    }

    RED.nodes.registerType('docker-container-actions', DockerContainerAction);
}

