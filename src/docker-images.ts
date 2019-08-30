import { Red } from 'node-red';
import { DockerConfig } from './docker-config';

module.exports = function(RED:Red) {
       function DockerImages(n) {
        RED.nodes.createNode(this,n);
        let config = (RED.nodes.getNode(n.config) as unknown as DockerConfig);
        let client = config.getClient();

        this.on('input', () => {
            client.listImages()
                .then(images => this.send({payload:images}))
                .catch(err => this.error(err));
        });
    }

    RED.nodes.registerType('docker-images', DockerImages);
}

