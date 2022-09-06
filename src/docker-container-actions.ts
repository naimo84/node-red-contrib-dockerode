import { Red, Node } from 'node-red';
import { DockerConfiguration } from './docker-configuration';
import * as Dockerode from 'dockerode';
let stream = require('stream');
var debug = require('debug')('node-red-contrib-dockerode:docker-container-actions')

module.exports = function (RED: Red) {


    function DockerContainerAction(n: any) {
        RED.nodes.createNode(this, n);
        let config = RED.nodes.getNode(n.config) as unknown as DockerConfiguration;
        let client = config.getClient();
        debug(`config ${config.host}`)
        this.on('input', (msg) => {
            let cmd = n.options || msg.cmd || msg.comand || msg.payload?.comand || undefined;
            let image = RED.util.evaluateNodeProperty(n.image, n.imagetype, n, msg);
            let action = n.action || msg.action || msg.payload?.action || undefined;
            let options = RED.util.evaluateNodeProperty(n.options, n.optionstype, n, msg) || msg.options || msg.options || msg.payload?.options || undefined;
            let containerId: string = RED.util.evaluateNodeProperty(n.container, n.containertype, n, msg) || msg.payload?.containerId || msg.containerId || msg.payload?.containerName || msg.containerName || undefined;

            if (containerId === undefined && !['list', 'prune', 'pull', 'run'].includes(action)) {
                this.error("Container id/name must be provided via configuration or via `msg.containerId`");
                return;
            }
            this.status({});

            executeAction(containerId, options, client, action, this, msg, image, {
                cmd: cmd,
                pullimage: n.pullimage,
                stream: n.stream,
                createOptions: RED.util.evaluateNodeProperty(n.createOptions !== '' ? n.createOptions : '{}', n.createOptionsType, n, msg) || {},
                deletecontainer: n.deletecontainer,
                startOptions: RED.util.evaluateNodeProperty(n.startOptions !== '' ? n.startOptions : '{}', n.startOptionsType, n, msg)
            });
        });


        async function executeAction(containerId: string, options: any, client: Dockerode, action: string, node: Node, msg, image, config) {
            let container = client.getContainer(containerId);
            debug(`action: ${action}`)
            debug(`containerId: ${containerId}`)
            switch (action) {
                case 'pull':
                    client.pull(image, { "disable-content-trust": "false" }, function (_err, pull) {
                        client.modem.followProgress(pull, (_err, _output) => {
                            node.send(Object.assign(msg, { payload: {} }));
                        });
                    });
                    break;

                case 'run':
                    if (config.pullimage) {
                        client.pull(image, { "disable-content-trust": "false" }, function (_err, pull) {
                            client.modem.followProgress(pull, (_err, _output) => {
                                //@ts-ignore
                                let eventEmmiter = null

                                if (config.deletecontainer) {//@ts-ignore
                                    eventEmmiter = client.run(image, ['sh', '-c', config.cmd], false, Object.assign(config.startOptions, { "HostConfig": { "AutoRemove": true } }), (err, _data, _container) => {
                                        if (err) {
                                            node.error(err, msg);
                                            node.send(Object.assign(msg, { payload: {}, err: err }))
                                        }
                                    })
                                } else {//@ts-ignore
                                    eventEmmiter = client.run(image, ['sh', '-c', config.cmd], false, config.createOptions, config.startOptions, (err: any, _data: any, _container: any) => {
                                        if (err) {
                                            node.error(err, msg);
                                            node.send(Object.assign(msg, { payload: {}, err: err }))
                                        }
                                    })
                                }

                                eventEmmiter.on('stream', (stream) => {
                                    stream.on('data', data => node.send({ payload: data.toString() }));
                                }).on('error', (err) => {
                                    debug(err)
                                    node.error(err, msg);
                                });
                            });
                        });
                    } else {

                        let eventEmmiter = null

                        if (config.deletecontainer) {//@ts-ignore
                            eventEmmiter = client.run(image, ['sh', '-c', config.cmd], false, Object.assign(config.startOptions, { "HostConfig": { "AutoRemove": true } }), (err, _data, _container) => {
                                if (err) {
                                    node.error(err, msg);
                                    node.send(Object.assign(msg, { payload: {}, err: err }))
                                }
                            })
                        } else {//@ts-ignore
                            eventEmmiter = client.run(image, ['sh', '-c', config.cmd], false, config.createOptions, config.startOptions, (err: any, _data: any, _container: any) => {
                                if (err) {
                                    node.error(err, msg);
                                    node.send(Object.assign(msg, { payload: {}, err: err }))
                                }
                            })
                        }

                        eventEmmiter.on('stream', (stream) => {
                            stream.on('data', data => node.send({ payload: data.toString() }));
                        }).on('error', (err) => {
                            debug(err)
                            node.error(err, msg);
                        });
                    }
                    break;

                case 'exec':
                    let execOptions = {
                        Cmd: ['sh', '-c', options],
                        AttachStdout: true,
                        AttachStderr: true
                    };
                    container.exec(execOptions)
                        .then(res => {
                            if (res) {
                                res.start({}, (err, input_stream) => {
                                    if (err) {
                                        //console.log("error : " + err);
                                        return;
                                    }

                                    var stdout = new stream.PassThrough();
                                    var stderr = new stream.PassThrough();
                                    container.modem.demuxStream(input_stream, stdout, stderr);

                                    let buffer_stdout = "";
                                    stdout.on('data', (chunk) => {
                                        buffer_stdout += chunk.toString();
                                    });

                                    let buffer_stderr = "";
                                    stderr.on('data', (chunk) => {
                                        buffer_stderr += chunk.toString();
                                    });

                                    input_stream.on('end', () => {
                                        node.send(Object.assign(msg, { payload: buffer_stdout }));
                                        if (buffer_stderr.trim().length > 0) {
                                            node.error(`Error exec container: ${buffer_stderr}`, msg);
                                        }
                                    });
                                });
                            }

                        }).catch(err => {
                            debug(err)
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`, msg);
                                node.send({ payload: err });
                            } else if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`, msg);
                                node.send({ payload: err });
                            } else {
                                node.error(`System Error:  [${err.statusCode}] ${err.reason}`, msg);
                                return;
                            }
                        });
                    break;

                case 'list':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerList

                    client.listContainers({ all: true })
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' started' });
                            node.send(Object.assign(msg, { payload: res }));
                        }).catch(err => {
                            debug(err)
                            if (err.statusCode === 400) {
                                node.error(`Bad parameter:  ${err.reason}`, msg);
                                node.send({ payload: err });
                            } else if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`, msg);
                                node.send({ payload: err });
                            } else {
                                node.error(`System Error:  [${err.statusCode}] ${err.reason}`, msg);
                                return;
                            }
                        });
                    break;

                case 'inspect':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerInspect

                    container.inspect()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' inspected' });
                            node.send(Object.assign(msg, { payload: res }));
                        }).catch(err => {
                            debug(err)
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`, msg);
                                node.send({ payload: err });
                            } else if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`, msg);
                                node.send({ payload: err });
                            } else {
                                node.error(`System Error:  [${err}]`, msg);
                                return;
                            }
                        });
                    break;

                case 'top':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerTop
                    container.top()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' killed' });
                            node.send(Object.assign(msg, { payload: res }));
                        }).catch(err => {
                            debug(err)
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`, msg);
                                node.send({ payload: err });
                            } else if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`, msg);
                                node.send({ payload: err });
                            } else {
                                node.error(`System Error:  [${err.statusCode}] ${err.reason}`, msg);
                                return;
                            }
                        });
                    break;

                case 'logs':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerLogs
                    let since = node.context().get("log_since") || 0;
                    node.warn("Getting logs since " + since);
                    container.logs({
                        stdout: true,
                        stderr: true,
                        since: since,
                        follow: false
                    }).then(res => {
                        node.status({ fill: 'green', shape: 'dot', text: containerId + ' logs read' });
                        node.context().set("log_since", Math.floor((new Date()).getTime() / 1000));
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(err => {
                        debug(err)
                        if (err.statusCode === 404) {
                            node.error(`No such container: [${containerId}]`, msg);
                            node.send({ payload: err });
                        } else if (err.statusCode === 500) {
                            node.error(`Server Error: [${err.statusCode}] ${err.reason}`, msg);
                            node.send({ payload: err });
                        } else {
                            node.error(`System Error:  [${err.statusCode}] ${err.reason}`, msg);
                            return;
                        }
                    });
                    break;

                case 'changes':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerChanges
                    container.changes()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' started' });
                            node.send(Object.assign(msg, { payload: res }));
                        }).catch(err => {
                            debug(err)
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`, msg);
                                node.send({ payload: err });
                            } else if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`, msg);
                                node.send({ payload: err });
                            } else {
                                node.error(`System Error:  [${err.statusCode}] ${err.reason}`, msg);
                                return;
                            }
                        });
                    break;

                case 'export':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerExport
                    container.export()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' started' });
                            node.send(Object.assign(msg, { payload: res }));
                        }).catch(err => {
                            debug(err)
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`, msg);
                                node.send({ payload: err });
                            } else if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`, msg);
                                node.send({ payload: err });
                            } else {
                                node.error(`System Error:  [${err.statusCode}] ${err.reason}`, msg);
                                return;
                            }
                        });
                    break;
                // TODO: make this it own objects
                case 'stats':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerStats    
                    if (!config.stream) {
                        container.stats({ stream: config.stream }, (err, data) => {
                            if (err) {
                                node.error('Error:', err)
                            }

                            node.send({
                                payload: data
                            })
                        });
                    } else {
                        container.stats().then((events: any) => {

                            node.status({ fill: 'green', shape: 'dot', text: 'node-red:common.status.connected' });

                            events.on('data', (data) => {
                                let event: any = {};
                                try {
                                    event = JSON.parse(data.toString());
                                } catch (e) {
                                    node.error('Error parsing JSON', msg);
                                    return
                                }

                                node.send({
                                    _msgid: RED.util.generateId(),
                                    type: event.Type,
                                    action: event.Action,
                                    time: event.time,
                                    timeNano: event.timeNano,
                                    payload: event
                                });
                            });

                            events.on('close', () => {
                                node.status({ fill: 'red', shape: 'ring', text: 'node-red:common.status.disconnected' });
                                node.warn('Docker event stream closed.');
                            });
                            events.on('error', (err) => {
                                node.status({ fill: 'red', shape: 'ring', text: 'node-red:common.status.disconnected' });
                                node.error('Error:' + err, msg);
                            });
                            events.on('end', () => {
                                node.status({ fill: 'yellow', shape: 'ring', text: 'stream ended' });
                                node.warn('Docker event stream ended.');
                            });
                        });
                    }
                    break;

                case 'resize':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerResize
                    container.resize()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' started' });
                            node.send(Object.assign(msg, { payload: res }));
                        }).catch(err => {
                            debug(err)
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`, msg);
                                node.send({ payload: err });
                            } else if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`, msg);
                                node.send({ payload: err });
                            } else {
                                node.error(`System Error:  [${err.statusCode}] ${err.reason}`, msg);
                                return;
                            }
                        });
                    break;

                case 'start':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerStart
                    container.start()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' started' });
                            node.send(Object.assign(msg, { payload: res }));
                        }).catch(err => {
                            debug(err)
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`, msg);
                                node.send({ payload: err });
                            } else if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`, msg);
                                node.send({ payload: err });
                            } else {
                                node.error(`System Error:  [${err.statusCode}] ${err.reason}`, msg);
                                return;
                            }
                        });
                    break;

                case 'stop':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerStop
                    container.stop()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' stopped' });
                            node.send(Object.assign(msg, { payload: res }));
                        }).catch(err => {
                            debug(err)
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`, msg);
                                node.send({ payload: err });
                            } else if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`, msg);
                                node.send({ payload: err });
                            } else {
                                node.error(`System Error:  [${err.statusCode}] ${err.reason}`, msg);
                                return;
                            }
                        });
                    break;

                case 'restart':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerRestart
                    container.restart()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' restarted' });
                            node.send(Object.assign(msg, { payload: res }));
                        }).catch(err => {
                            debug(err)
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`, msg);
                                node.send({ payload: err });
                            } else if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`, msg);
                                node.send({ payload: err });
                            } else {
                                node.error(`System Error:  [${err.statusCode}] ${err.reason}`, msg);
                                return;
                            }
                        });
                    break;

                case 'kill':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerKill
                    container.kill()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' killed' });
                            node.send(Object.assign(msg, { payload: res }));
                        }).catch(err => {
                            debug(err)
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`, msg);
                                node.send({ payload: err });
                            } else if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`, msg);
                                node.send({ payload: err });
                            } else {
                                node.error(`System Error:  [${err.statusCode}] ${err.reason}`, msg);
                                return;
                            }
                        });
                    break;

                case 'update':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerUpdate
                    container.update(options)
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' started' });
                            node.send(Object.assign(msg, { payload: res }));
                        }).catch(err => {
                            debug(err)
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`, msg);
                                node.send({ payload: err });
                            } else if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`, msg);
                                node.send({ payload: err });
                            } else {
                                node.error(`System Error:  [${err.statusCode}] ${err.reason}`, msg);
                                return;
                            }
                        });
                    break;

                case 'rename':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerRename
                    container.rename(options)
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' started' });
                            node.send(Object.assign(msg, { payload: res }));
                        }).catch(err => {
                            debug(err)
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`, msg);
                                node.send({ payload: err });
                            } else if (err.statusCode === 409) {
                                node.error(`Name already in use: [${err.statusCode}] ${err.reason}`, msg);
                                node.send({ payload: err });
                            } else if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`, msg);
                                node.send({ payload: err });
                            } else {
                                node.error(`System Error:  [${err.statusCode}] ${err.reason}`, msg);
                                return;
                            }
                        });
                    break;

                case 'pause':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerPause
                    container.pause()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' stopped' });
                            node.send(Object.assign(msg, { payload: res }));
                        }).catch(err => {
                            debug(err)
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`, msg);
                                node.send({ payload: err });
                            } else if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`, msg);
                                node.send({ payload: err });
                            } else {
                                node.error(`System Error:  [${err.statusCode}] ${err.reason}`, msg);
                                return;
                            }
                        });
                    break;

                case 'unpause':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerUnpause
                    container.unpause()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' stopped' });
                            node.send(Object.assign(msg, { payload: res }));
                        }).catch(err => {
                            debug(err)
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`, msg);
                                node.send({ payload: err });
                            } else if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`, msg);
                                node.send({ payload: err });
                            } else {
                                node.error(`System Error:  [${err.statusCode}] ${err.reason}`, msg);
                                return;
                            }
                        });
                    break;

                case 'wait':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerWait
                    container.wait()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' killed' });
                            node.send(Object.assign(msg, { payload: res }));
                        }).catch(err => {
                            debug(err)
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`, msg);
                                node.send({ payload: err });
                            } else if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`, msg);
                                node.send({ payload: err });
                            } else {
                                node.error(`System Error:  [${err.statusCode}] ${err.reason}`, msg);
                                return;
                            }
                        });
                    break;

                case 'remove':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerDelete
                    container.remove()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' killed' });
                            node.send(Object.assign(msg, { payload: res }));
                        }).catch(err => {
                            debug(err)
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`, msg);
                                node.send({ payload: err });
                            } else if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`, msg);
                                node.send({ payload: err });
                            } else {
                                node.error(`System Error:  [${err.statusCode}] ${err.reason}`, msg);
                                return;
                            }
                        });
                    break;

                case 'archive-info':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerArchiveInfo
                    container.infoArchive({ 'path': config.cmd })
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' killed' });
                            node.send(Object.assign(msg, { payload: res }));
                        }).catch(err => {
                            debug(err)
                            if (err.statusCode === 404) {
                                node.error(`Container or path does not exist: [${containerId}]`, msg);
                                node.send({ payload: err });
                            } else if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`, msg);
                                node.send({ payload: err });
                            } else {
                                node.error(`System Error:  [${err.statusCode}] ${err.reason}`, msg);
                                console.log(err);
                                return;
                            }
                        });
                    break;

                case 'get-archive':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerArchive
                    container.getArchive(options)
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' killed' });
                            node.send(Object.assign(msg, { payload: res }));
                        }).catch(err => {
                            debug(err)
                            if (err.statusCode === 404) {
                                node.error(`Container or path does not exist: [${containerId}]`, msg);
                                node.send({ payload: err });
                            } else if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`, msg);
                                node.send({ payload: err });
                            } else {
                                node.error(`System Error:  [${err.statusCode}] ${err.reason}`, msg);
                                return;
                            }
                        });
                    break;

                case 'prune':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerPrune
                    client.pruneContainers()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: containerId + ' started' });
                            node.send(Object.assign(msg, { payload: res }));
                        }).catch(err => {
                            debug(err)
                            if (err.statusCode === 404) {
                                node.error(`No such container: [${containerId}]`, msg);
                                node.send({ payload: err });
                            } else if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`, msg);
                                node.send({ payload: err });
                            } else {
                                node.error(`System Error:  [${err.statusCode}] ${err.reason}`, msg);
                                return;
                            }
                        });
                    break;

                case 'create':
                    // https://docs.docker.com/engine/api/v1.40/#operation/ContainerCreate
                    let create = false;
                    try {
                        const stats = await container.stats()
                        console.log(stats.read)
                    } catch (err) {
                        create = true
                    }
                    if (create) {
                        client.createContainer(Object.assign(options, { 'name': containerId }))
                            .then(res => {
                                node.status({ fill: 'green', shape: 'dot', text: containerId + ' started' });
                                node.send(Object.assign(msg, { payload: res }));
                            }).catch(err => {
                                debug(err)
                                if (err.statusCode === 400) {
                                    node.error(`Bad parmeter: [${err.reason}]`, msg);
                                    node.send({ payload: err });
                                } else if (err.statusCode === 500) {
                                    node.error(`Server Error: [${err.statusCode}] ${err.reason}`, msg);
                                    node.send({ payload: err });
                                } else {
                                    node.error(`System Error:  [${err.statusCode}] ${err}`, msg);
                                    return;
                                }
                            });
                    } else {
                        node.send(Object.assign(msg, { payload: {} }));
                    }
                    break;
                default:
                    node.error(`Called with an unknown action: ${action}`, msg);
                    return;
            }
        }
    }

    RED.httpAdmin.post("/containerSearch", function (req, res) {
        RED.log.debug("POST /containerSearch");

        const nodeId = req.body.id;
        let config = RED.nodes.getNode(nodeId);

        discoverSonos(config, (containers) => {
            RED.log.debug("GET /containerSearch: " + containers.length + " found");
            res.json(containers);
        }, (err) => {
            res.json(err)
        });
    });

    function discoverSonos(config, discoveryCallback, errCallback) {
        let client = config.getClient();
        client.listContainers({ all: true })
            .then(containers => discoveryCallback(containers))
            .catch(err => errCallback(err));
    }

    RED.nodes.registerType('docker-container-actions', DockerContainerAction);
}

