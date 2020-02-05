import { Red } from 'node-red';
import { DockerConfiguration } from './docker-configuration';

module.exports = function (RED: Red) {

    function DockerNodes(n) {
        RED.nodes.createNode(this, n);
        let config = (RED.nodes.getNode(n.config) as unknown as DockerConfiguration);
        if (!config) {
            this.status({ fill: "red", shape: "ring", text: "no configuration" });
            return;
        }
        let client = config.getClient();

        this.on('input', (msg) => {
            client.listNodes({ all: true })
                .then(nodes => {
                    this.send(Object.assign(msg, { payload: nodes }));
                })
                .catch(err => {
                    this.send({ payload: {} })
                    this.error(err)
                });

        });
    }
    
    RED.httpAdmin.post("/nodeSearch", function (req, res) {
        RED.log.debug("POST /nodeSearch");

        const nodeId = req.body.id;
        let config = RED.nodes.getNode(nodeId);

        discoverSonos(config, (nodes) => {
            RED.log.debug("GET /nodeSearch: " + nodes.length + " found");
            res.json(nodes);
        });
    });

    function discoverSonos(config, discoveryCallback) {
        let client = config.getClient();
        client.listNodes({ all: true })
            .then(nodes => discoveryCallback(nodes))
            .catch(err => this.error(err));
    }

    RED.nodes.registerType('docker-nodes', DockerNodes);
}

