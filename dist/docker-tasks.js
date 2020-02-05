"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function DockerTasks(n) {
        var _this = this;
        RED.nodes.createNode(this, n);
        var config = RED.nodes.getNode(n.config);
        if (!config) {
            this.status({ fill: "red", shape: "ring", text: "no configuration" });
            return;
        }
        var client = config.getClient();
        this.on('input', function (msg) {
            client.listTasks({ all: true })
                .then(function (tasks) {
                _this.send(Object.assign(msg, { payload: tasks }));
            })
                .catch(function (err) {
                _this.send({ payload: {} });
                _this.error(err);
            });
        });
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
    RED.nodes.registerType('docker-tasks', DockerTasks);
};
