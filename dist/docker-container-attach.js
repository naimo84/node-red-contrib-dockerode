"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stream = require('stream');
module.exports = function (RED) {
    function DockerContainerAttach(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        var client = config.getClient();
        this.on('input', function (msg) {
            var cid = n.container || msg.container || undefined;
            var cmd = n.cmd || msg.cmd || msg.command || undefined;
            if (cid === undefined) {
                _this.error("Container id/name must be provided via configuration or via `msg.container`");
                return;
            }
            _this.status({});
            executeAttach(cid, client, cmd, _this, msg);
        });
    }
    function executeAttach(cid, client, cmd, node, msg) {
        var container = client.getContainer(cid);
        var options = {
            Cmd: ['sh', '-c', cmd],
            AttachStdout: true,
            AttachStderr: true
        };
        container.exec(options).then(function (res) {
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
            if (err.statusCode === 304) {
                node.warn("Unable to exec container \"" + cid + "\".");
                node.send({ payload: err });
            }
            else {
                node.error("Error exec container: [" + err.statusCode + "] " + err.reason);
                return;
            }
        });
    }
    RED.nodes.registerType('docker-container-attach', DockerContainerAttach);
};
