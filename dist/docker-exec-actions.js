"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stream = require('stream');
module.exports = function (RED) {
    function DockerExecAction(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        var client = config.getClient();
        this.on('input', function (msg) {
            var containerId = n.containerId || msg.payload.containerId || msg.containerId || undefined;
            var action = n.action || msg.action || msg.payload.action || undefined;
            var cmd = n.cmd || msg.cmd || msg.command || msg.payload.command || undefined;
            if (containerId === undefined) {
                _this.error("Container id/name must be provided via configuration or via `msg.containerId`");
                return;
            }
            _this.status({});
            executeAction(containerId, client, action, cmd, _this, msg);
        });
        function executeAction(containerId, client, action, cmd, node, msg) {
            var container = client.getContainer(containerId);
            switch (action) {
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
                                    //console.log("error : " + err);
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
                                    node.send(Object.assign(msg, { payload: buffer_stdout }));
                                    if (buffer_stderr.trim().length > 0) {
                                        node.error("Error exec container: " + buffer_stderr);
                                    }
                                });
                            });
                        }
                    }).catch(function (err) {
                        if (err.statusCode === 404) {
                            node.error("No such container: [" + containerId + "]");
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
                default:
                    node.error("Called with an unknown action: " + action);
                    return;
            }
        }
    }
    RED.nodes.registerType('docker-exec-actions', DockerExecAction);
};
