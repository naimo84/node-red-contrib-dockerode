import { Red } from 'node-red';
import { DockerConfiguration } from './docker-configuration';

module.exports = function (RED: Red) {
    function DockerPlugins(n) {
        RED.nodes.createNode(this, n);
        let config = (RED.nodes.getNode(n.config) as unknown as DockerConfiguration);
        if (!config) {
            this.status({ fill: "red", shape: "ring", text: "no configuration" });
            return;
        }
        let client = config.getClient();

        this.on('input', (msg) => {
            client.listPlugins({ all: false })
                .then(plugins => {
                    this.send(Object.assign(msg, { payload: plugins }));
                })
                .catch(err => {
                    this.send({ payload: {} })
                    this.error(err)
                });

        });
    }
    
    RED.httpAdmin.post("/pluginSearch", function (req, res) {
        RED.log.debug("POST /pluginSearch");

        const nodeId = req.body.id;
        let config = RED.nodes.getNode(nodeId);

        discoverSonos(config, (plugins) => {
            RED.log.debug("GET /pluginSearch: " + plugins.length + " found");
            res.json(plugins);
        });
    });

    function discoverSonos(config, discoveryCallback) {
        let client = config.getClient();
        client.listPlugins({ all: false })
//            .then(plugins => console.log(plugins))
            .then(plugins => discoveryCallback(plugins))
            .catch(err => this.error(err));
    }

    RED.nodes.registerType('docker-plugins', DockerPlugins);
}

