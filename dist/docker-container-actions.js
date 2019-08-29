"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stream = require('stream');
module.exports = function (RED) {
    'use strict';
    function DockerContainerAction(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        var client = config.getClient();
        this.on('input', function (msg) {
            var cid = n.container || msg.container || undefined;
            var action = n.action || msg.action || msg.payload || undefined;
            var cmd = n.cmd || msg.cmd || msg.command || undefined;
            if (cid === undefined) {
                _this.error("Container id/name must be provided via configuration or via `msg.container`");
                return;
            }
            _this.status({});
            executeAction(cid, client, action, cmd, _this);
        });
        function executeAction(cid, client, action, cmd, node) {
            var container = client.getContainer(cid);
            switch (action) {
                case 'start':
                    container.start()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' started' });
                        node.send({ payload: res });
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to start container \"" + cid + "\", container is already started.");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error starting container:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'stop':
                    container.stop()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' stopped' });
                        node.send({ payload: res });
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to stop container \"" + cid + "\", container is already stopped.");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error stopping container: [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'restart':
                    container.restart()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' restarted' });
                        node.send({ payload: res });
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to restart container \"" + cid + "\".");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error restarting container: [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'kill':
                    container.kill()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: cid + ' killed' });
                        node.send({ payload: res });
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to kill container \"" + cid + "\".");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error killing container: [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'exec':
                    var options = {
                        Cmd: ['sh', '-c', cmd],
                        AttachStdout: true,
                        AttachStderr: true
                    };
                    container.exec(options)
                        .then(function (res) {
                        if (res) {
                            res.start(function (err, input_stream) {
                                if (err) {
                                    console.log("error : " + err);
                                    return;
                                }
                                var stdout = new stream.PassThrough();
                                var stderr = new stream.PassThrough();
                                container.modem.demuxStream(input_stream, stdout, stderr);
                                var buffer_stdout = "";
                                stdout.on('data', function (chunk) {
                                    buffer_stdout += chunk.toString();
                                });
                                var buffer_stderr = "";
                                stderr.on('data', function (chunk) {
                                    buffer_stderr += chunk.toString();
                                });
                                input_stream.on('end', function () {
                                    node.send({ payload: buffer_stdout });
                                    if (buffer_stderr.trim().length > 0) {
                                        node.error("Error exec container: " + buffer_stderr);
                                    }
                                });
                            });
                        }
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to exec container \"" + cid + "\".");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error exec container: [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                default:
                    node.error("Called with an unknown action: " + action);
                    return;
            }
        }
    }
    RED.nodes.registerType('docker-container-actions', DockerContainerAction);
};
