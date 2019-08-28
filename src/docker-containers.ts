import { Red, Node } from 'node-red';
import { DockerConfig } from './docker-config';

module.exports = function(RED:Red) {
    'use strict';

    function DckerContainers(n) {
        RED.nodes.createNode(this,n);
        let config = (RED.nodes.getNode(n.config) as unknown as DockerConfig);
        let client = config.getClient();

        this.on('input', () => {
            client.listContainers({all:false})
                .then(containers => this.send({payload:containers}))
                .catch(err => this.error(err));
        });
    }

    RED.nodes.registerType('docker-containers', DckerContainers);
}

