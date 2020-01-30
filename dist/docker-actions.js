"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function DockerAction(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        var client = config.getClient();
        this.on('input', function (msg) {
            var action = n.action || msg.action || msg.payload || undefined;
            var cmd = n.cmd || msg.cmd || msg.command || undefined;
            _this.status({});
            executeAction(client, action, cmd, _this, msg);
        });
        function executeAction(client, action, cmd, node, msg) {
            console.log(cmd);
            var docker = client;
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
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: ' started' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to start docker is already started.");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error starting docker:  [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'info':
                    docker.info()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: ' stopped' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to stop , docker is already stopped.");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error stopping docker: [" + err.statusCode + "] " + err.reason);
                            return;
                        }
                    });
                    break;
                case 'version':
                    docker.version()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: ' restarted' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 304) {
                            node.warn("Unable to restart docker");
                            node.send({ payload: err });
                        }
                        else {
                            node.error("Error restarting docker: [" + err.statusCode + "] " + err.reason);
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
    RED.nodes.registerType('docker-actions', DockerAction);
};
