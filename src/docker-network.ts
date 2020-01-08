import { Red } from 'node-red';
import { DockerConfiguration } from './docker-configuration';

module.exports = function (RED: Red) {
    function DockerNetworks(n) {
        RED.nodes.createNode(this, n);
        let config = (RED.nodes.getNode(n.config) as unknown as DockerConfiguration);
        if (!config) {
            this.status({ fill: "red", shape: "ring", text: "no configuration" });
            return;
        }
        let client = config.getClient();

        this.on('input', (msg) => {
            client.listNetworks({ all: false })
                .then(networks => {
                    this.send(Object.assign(msg, { payload: networks }));
                })
                .catch(err => {
                    this.send({ payload: {} })
                    this.error(err)
                });

        });
    }
    
    RED.httpAdmin.post("/networkSearch", function (req, res) {
        RED.log.debug("POST /networkSearch");

        const nodeId = req.body.id;
        let config = RED.nodes.getNode(nodeId);

        discoverSonos(config, (networks) => {
            RED.log.debug("GET /networkSearch: " + networks.length + " found");
            res.json(networks);
        });
    });

    function discoverSonos(config, discoveryCallback) {
        let client = config.getClient();
        client.listNetworks({ all: false })
//            .then(networks => console.log(networks))
            .then(networks => discoveryCallback(networks))
            .catch(err => this.error(err));
    }

    RED.nodes.registerType('docker-networks', DockerNetworks);
}

