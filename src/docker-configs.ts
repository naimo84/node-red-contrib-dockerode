import { Red } from 'node-red';
import { DockerConfiguration } from './docker-configuration';

module.exports = function (RED: Red) {
    function DockerConfigs(n) {
        RED.nodes.createNode(this, n);
        let config = (RED.nodes.getNode(n.config) as unknown as DockerConfiguration);
        if (!config) {
            this.status({ fill: "red", shape: "ring", text: "no configuration" });
            return;
        }
        let client = config.getClient();

        this.on('input', (msg) => {
            client.listConfigs({ all: false })
                .then(configs => {
                    this.send(Object.assign(msg, { payload: configs }));
                })
                .catch(err => {
                    this.send({ payload: {} })
                    this.error(err)
                });

        });
    }
    
    RED.httpAdmin.post("/configSearch", function (req, res) {
        RED.log.debug("POST /configSearch");

        const nodeId = req.body.id;
        let config = RED.nodes.getNode(nodeId);

        discoverSonos(config, (configs) => {
            RED.log.debug("GET /configSearch: " + configs.length + " found");
            res.json(configs);
        });
    });

    function discoverSonos(config, discoveryCallback) {
        let client = config.getClient();
        client.listConfigs({ all: false })
//            .then(configs => console.log(configs))
            .then(configs => discoveryCallback(configs))
            .catch(err => this.error(err));
    }

    RED.nodes.registerType('docker-configs', DockerConfigs);
}

