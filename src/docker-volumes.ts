import { Red } from 'node-red';
import { DockerConfiguration } from './docker-configuration';

module.exports = function (RED: Red) {
    function DockerVolumes(n) {
        RED.nodes.createNode(this, n);
        let config = (RED.nodes.getNode(n.config) as unknown as DockerConfiguration);
        if (!config) {
            this.status({ fill: "red", shape: "ring", text: "no configuration" });
            return;
        }
        let client = config.getClient();

        this.on('input', (msg) => {
            client.listVolumes({ all: true })
                .then(volumes => {
                    this.send(Object.assign(msg, { payload: volumes }));
                })
                .catch(err => {
                    this.send({ payload: {} })
                    this.error(err)
                });

        });
    }
    
    RED.httpAdmin.post("/volumeSearch", function (req, res) {
        RED.log.debug("POST /volumeSearch");

        const nodeId = req.body.id;
        let config = RED.nodes.getNode(nodeId);

        discoverSonos(config, (volumes) => {
            RED.log.debug("GET /volumeSearch: " + volumes.length + " found");
            res.json(volumes);
        });
    });

    function discoverSonos(config, discoveryCallback) {
        let client = config.getClient();
        client.listVolumes({ all: true })
//            .then(volumes => console.log(volumes))
            .then(volumes => discoveryCallback(volumes))
            .catch(err => this.error(err));
    }

    RED.nodes.registerType('docker-volumes', DockerVolumes);
}

