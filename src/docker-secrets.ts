import { Red } from 'node-red';
import { DockerConfiguration } from './docker-configuration';

module.exports = function (RED: Red) {
    function DockerSecrets(n) {
        RED.nodes.createNode(this, n);
        let config = (RED.nodes.getNode(n.config) as unknown as DockerConfiguration);
        if (!config) {
            this.status({ fill: "red", shape: "ring", text: "no configuration" });
            return;
        }
        let client = config.getClient();

        this.on('input', (msg) => {
            client.listSecrets({ all: false })
                .then(secrets => {
                    this.send(Object.assign(msg, { payload: secrets }));
                })
                .catch(err => {
                    this.send({ payload: {} })
                    this.error(err)
                });

        });
    }
    
    RED.httpAdmin.post("/secretSearch", function (req, res) {
        RED.log.debug("POST /secretSearch");

        const nodeId = req.body.id;
        let config = RED.nodes.getNode(nodeId);

        discoverSonos(config, (secrets) => {
            RED.log.debug("GET /secretSearch: " + secrets.length + " found");
            res.json(secrets);
        });
    });

    function discoverSonos(config, discoveryCallback) {
        let client = config.getClient();
        client.listSecrets({ all: false })
//            .then(secrets => console.log(secrets))
            .then(secrets => discoveryCallback(secrets))
            .catch(err => this.error(err));
    }

    RED.nodes.registerType('docker-secrets', DockerSecrets);
}

