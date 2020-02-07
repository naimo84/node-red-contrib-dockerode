"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function DockerTaskAction(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        var client = config.getClient();
        this.on('input', function (msg) {
            var taskId = n.task || msg.payload.taskId || msg.taskId || undefined;
            var action = n.action || msg.action || msg.payload.action || undefined;
            if (taskId === undefined && !['list', 'prune', 'create'].includes(action)) {
                _this.error("Task id/name must be provided via configuration or via `msg.task`");
                return;
            }
            _this.status({});
            executeAction(taskId, client, action, _this, msg);
        });
        function executeAction(taskId, client, action, node, msg) {
            var task = client.getTask(taskId);
            switch (action) {
                case 'list':
                    // https://docs.docker.com/engine/api/v1.40/#operation/TaskList
                    client.listTasks({ all: true })
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: taskId + ' started' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 400) {
                            node.error("Bad parameter:  " + err.reason);
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
                case 'inspect':
                    // https://docs.docker.com/engine/api/v1.40/#operation/TaskInspect
                    task.inspect()
                        .then(function (res) {
                        node.status({ fill: 'green', shape: 'dot', text: taskId + ' started' });
                        node.send(Object.assign(msg, { payload: res }));
                    }).catch(function (err) {
                        if (err.statusCode === 500) {
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
                                    case 'log':
                                        // https://docs.docker.com/engine/api/v1.40/#operation/Session
                                        task.logs(options)
                                            .then(res => {
                                                node.status({ fill: 'green', shape: 'dot', text: taskId + ' started' });
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
                */
                default:
                    node.error("Called with an unknown action: " + action);
                    return;
            }
        }
    }
    RED.httpAdmin.post("/taskSearch", function (req, res) {
        RED.log.debug("POST /taskSearch");
        var nodeId = req.body.id;
        var config = RED.nodes.getNode(nodeId);
        discoverSonos(config, function (tasks) {
            RED.log.debug("GET /taskSearch: " + tasks.length + " found");
            res.json(tasks);
        });
    });
    function discoverSonos(config, discoveryCallback) {
        var _this = this;
        var client = config.getClient();
        client.listTasks({ all: true })
            //            .then(tasks => console.log(tasks))
            .then(function (tasks) { return discoveryCallback(tasks); })
            .catch(function (err) { return _this.error(err); });
    }
    RED.nodes.registerType('docker-task-actions', DockerTaskAction);
};
