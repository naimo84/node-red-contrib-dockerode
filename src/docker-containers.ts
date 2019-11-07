import { Red } from 'node-red';
import { DockerConfig } from './docker-config';

module.exports = function (RED: Red) {



    function DckerContainers(n) {
        RED.nodes.createNode(this, n);
        let config = (RED.nodes.getNode(n.config) as unknown as DockerConfig);
        if (!config) {
            this.status({ fill: "red", shape: "ring", text: "no configuration" });
            return;
        }
        let client = config.getClient();

        this.on('input', (msg) => {
            client.listContainers({ all: false })
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
        client.listContainers({ all: false })
            .then(containers => discoveryCallback(containers))
            .catch(err => this.error(err));
    }

    RED.nodes.registerType('docker-containers', DckerContainers);
}

