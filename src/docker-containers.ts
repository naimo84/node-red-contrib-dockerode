import { Red } from 'node-red';
import { DockerConfiguration } from './docker-configuration';

module.exports = function (RED: Red) {

    function DockerContainers(n) {
        RED.nodes.createNode(this, n);
        let config = (RED.nodes.getNode(n.config) as unknown as DockerConfiguration);
        if (!config) {
            this.status({ fill: "red", shape: "ring", text: "no configuration" });
            return;
        }
        let client = config.getClient();

        this.on('input', (msg) => {
            client.listContainers({ all: true })
                .then(containers => {
                    this.send(Object.assign(msg, { payload: containers }));
                })
                .catch(err => {
                    this.send({ payload: {} })
                    this.error(err)
                });

        });
    }

    RED.httpAdmin.post("/containerSearch", function (req, res) {
        RED.log.debug("POST /containerSearch");

        const nodeId = req.body.id;
        let config = RED.nodes.getNode(nodeId);

        discoverSonos(config, (containers) => {
            RED.log.debug("GET /containerSearch: " + containers.length + " found");
            res.json(containers);
        });
    });

    function discoverSonos(config, discoveryCallback) {
        let client = config.getClient();
        client.listContainers({ all: true })
            .then(containers => discoveryCallback(containers))
            .catch(err => this.error(err));
    }

    RED.nodes.registerType('docker-containers', DockerContainers);
}

