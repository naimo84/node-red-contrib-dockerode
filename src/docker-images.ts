import { Red } from 'node-red';
import { DockerConfiguration } from './docker-configuration';

module.exports = function (RED: Red) {

    function DockerImages(n) {
        RED.nodes.createNode(this, n);
        let config = (RED.nodes.getNode(n.config) as unknown as DockerConfiguration);
        if (!config) {
            this.status({ fill: "red", shape: "ring", text: "no configuration" });
            return;
        }
        let client = config.getClient();

        this.on('input', (msg) => {
            client.listImages({ all: true })
                .then(images => {
                    this.send(Object.assign(msg, { payload: images }));
                })
                .catch(err => {
                    this.send({ payload: {} })
                    this.error(err)
                });

        });
    }
    
    RED.httpAdmin.post("/imageSearch", function (req, res) {
        RED.log.debug("POST /imageSearch");

        const nodeId = req.body.id;
        let config = RED.nodes.getNode(nodeId);

        discoverSonos(config, (images) => {
            RED.log.debug("GET /imageSearch: " + images.length + " found");
            res.json(images);
        });
    });

    function discoverSonos(config, discoveryCallback) {
        let client = config.getClient();
        client.listImages({ all: true })
            .then(images => discoveryCallback(images))
            .catch(err => this.error(err));
    }

    RED.nodes.registerType('docker-images', DockerImages);
}

