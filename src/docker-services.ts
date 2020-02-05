import { Red } from 'node-red';
import { DockerConfiguration } from './docker-configuration';

module.exports = function (RED: Red) {

    function DockerServices(n) {
        RED.nodes.createNode(this, n);
        let config = (RED.nodes.getNode(n.config) as unknown as DockerConfiguration);
        if (!config) {
            this.status({ fill: "red", shape: "ring", text: "no configuration" });
            return;
        }
        let client = config.getClient();

        this.on('input', (msg) => {
            client.listServices({ all: true })
                .then(services => {
                    this.send(Object.assign(msg, { payload: services }));
                })
                .catch(err => {
                    this.send({ payload: {} })
                    this.error(err)
                });

        });
    }
    
    RED.httpAdmin.post("/serviceSearch", function (req, res) {
        RED.log.debug("POST /serviceSearch");

        const nodeId = req.body.id;
        let config = RED.nodes.getNode(nodeId);

        discoverSonos(config, (services) => {
            RED.log.debug("GET /serviceSearch: " + services.length + " found");
            res.json(services);
        });
    });

    function discoverSonos(config, discoveryCallback) {
        let client = config.getClient();
        client.listServices({ all: true })
            .then(services => discoveryCallback(services))
            .catch(err => this.error(err));
    }

    RED.nodes.registerType('docker-services', DockerServices);
}

