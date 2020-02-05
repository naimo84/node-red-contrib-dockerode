"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function DockerContainerAction(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        var client = config.getClient();
        this.on('input', function (msg) {
            var cid = n.container || msg.payload.container || msg.container || undefined;
            var action = n.action || msg.action || msg.payload.action || undefined;
            var cmd = n.cmd || msg.cmd || msg.command || msg.payload.command || undefined;
            if (cid === undefined) {
                _this.error("Container id/name must be provided via configuration or via `msg.container`");
                return;
            }
            _this.status({});
            executeAction(cid, client, action, cmd, _this, msg);
        });
        function executeAction(cid, client, action, cmd, node, msg) {
            var container = client.getContainer(cid);
            switch (action) {
                case 'inspect':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerInspect
                    container.inspect()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' started' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 404) {
                            node.error("No such container: [" + cid + "]");
                            node.send({ payload: err });
                        }
                        else if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'top':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerTop
                    container.top()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' killed' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 404) {
                            node.error("No such container: [" + cid + "]");
                            node.send({ payload: err });
                        }
                        else if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'logs':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerLogs
                    container.logs()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' restarted' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 404) {
                            node.error("No such container: [" + cid + "]");
                            node.send({ payload: err });
                        }
                        else if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'changes':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerChanges
                    container.changes()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' started' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 404) {
                            node.error("No such container: [" + cid + "]");
                            node.send({ payload: err });
                        }
                        else if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'export':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerExport
                    container.export()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' started' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 404) {
                            node.error("No such container: [" + cid + "]");
                            node.send({ payload: err });
                        }
                        else if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'stats':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerStats
                    container.stats()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' restarted' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 404) {
                            node.error("No such container: [" + cid + "]");
                            node.send({ payload: err });
                        }
                        else if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'resize':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerResize
                    container.resize()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' started' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 404) {
                            node.error("No such container: [" + cid + "]");
                            node.send({ payload: err });
                        }
                        else if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'start':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerStart
                    container.start()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' started' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 404) {
                            node.error("No such container: [" + cid + "]");
                            node.send({ payload: err });
                        }
                        else if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'stop':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerStop
                    container.stop()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' stopped' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 404) {
                            node.error("No such container: [" + cid + "]");
                            node.send({ payload: err });
                        }
                        else if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'restart':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerRestart
                    container.restart()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' restarted' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 404) {
                            node.error("No such container: [" + cid + "]");
                            node.send({ payload: err });
                        }
                        else if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'kill':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerKill
                    container.kill()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' killed' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 404) {
                            node.error("No such container: [" + cid + "]");
                            node.send({ payload: err });
                        }
                        else if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'update':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerUpdate
                    container.update(cmd)
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' started' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 404) {
                            node.error("No such container: [" + cid + "]");
                            node.send({ payload: err });
                        }
                        else if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'rename':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerRename
                    container.rename(cmd)
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' started' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 404) {
                            node.error("No such container: [" + cid + "]");
                            node.send({ payload: err });
                        }
                        else if (err.statusCode === 409) {
                            node.error("Name already in use: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'pause':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerPause
                    container.pause()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' stopped' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 404) {
                            node.error("No such container: [" + cid + "]");
                            node.send({ payload: err });
                        }
                        else if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'unpause':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerUnpause
                    container.unpause()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' stopped' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 404) {
                            node.error("No such container: [" + cid + "]");
                            node.send({ payload: err });
                        }
                        else if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'attach':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerAttach
                    container.attach(cmd)
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' started' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 404) {
                            node.error("No such container: [" + cid + "]");
                            node.send({ payload: err });
                        }
                        else if (err.statusCode === 400) {
                            node.error("Bad parameter: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
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
                                                node.status({ fill: 'green', shape: 'dot', text: cid + ' started' });
                                                node.send(Object.assign(msg,{ payload: res }));
                                            }).catch(err => {
                                                if (err.statusCode === 404) {
                                                    node.error(`No such container: [${cid}]`);
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
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' killed' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 404) {
                            node.error("No such container: [" + cid + "]");
                            node.send({ payload: err });
                        }
                        else if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'remove':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerDelete
                    container.remove()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' killed' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 404) {
                            node.error("No such container: [" + cid + "]");
                            node.send({ payload: err });
                        }
                        else if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'archive-info':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerArchiveInfo
                    container.infoArchive(cmd)
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' killed' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 404) {
                            node.error("Container or path does not exist: [" + cid + "]");
                            node.send({ payload: err });
                        }
                        else if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'get-archive':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerArchive
                    container.getArchive(cmd)
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' killed' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 404) {
                            node.error("Container or path does not exist: [" + cid + "]");
                            node.send({ payload: err });
                        }
                        else if (err.statusCode === 500) {
                            node.error("Server Error: [" + err.statusCode + "] " + err.reason);
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Sytem Error:  [" + err.statusCode + "] " + err.reason);
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
                                            node.status({ fill: 'green', shape: 'dot', text: cid + ' killed' });
                                            node.send(Object.assign(msg,{ payload: res }));
                                        }).catch(err => {
                                            if (err.statusCode === 404) {
                                                node.error(`No such container or path does not exist inside the container: [${cid}]`);
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
                                            node.status({ fill: 'green', shape: 'dot', text: cid + ' started' });
                                            node.send(Object.assign(msg,{ payload: res }));
                                        }).catch(err => {
                                            if (err.statusCode === 404) {
                                                node.error(`No such container: [${cid}]`);
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
};
