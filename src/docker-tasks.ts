import { Red } from 'node-red';
import { DockerConfiguration } from './docker-configuration';

module.exports = function (RED: Red) {
    
    function DockerTasks(n) {
        RED.nodes.createNode(this, n);
        let config = (RED.nodes.getNode(n.config) as unknown as DockerConfiguration);
        if (!config) {
            this.status({ fill: "red", shape: "ring", text: "no configuration" });
            return;
        }
        let client = config.getClient();

        this.on('input', (msg) => {
            client.listTasks({ all: true })
                .then(tasks => {
                    this.send(Object.assign(msg, { payload: tasks }));
                })
                .catch(err => {
                    this.send({ payload: {} })
                    this.error(err)
                });

        });
    }
    
    RED.httpAdmin.post("/taskSearch", function (req, res) {
        RED.log.debug("POST /taskSearch");

        const nodeId = req.body.id;
        let config = RED.nodes.getNode(nodeId);

        discoverSonos(config, (tasks) => {
            RED.log.debug("GET /taskSearch: " + tasks.length + " found");
            res.json(tasks);
        });
    });

    function discoverSonos(config, discoveryCallback) {
        let client = config.getClient();
        client.listTasks({ all: true })
//            .then(tasks => console.log(tasks))
            .then(tasks => discoveryCallback(tasks))
            .catch(err => this.error(err));
    }

    RED.nodes.registerType('docker-tasks', DockerTasks);
}

