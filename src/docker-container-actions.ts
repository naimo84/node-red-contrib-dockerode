import { Red, Node } from 'node-red';

module.exports = function (RED: Red) {
    'use strict';

    function DockerContainerAction(n: any) {
        RED.nodes.createNode(this, n);

        this.config = RED.nodes.getNode(n.config);
        this.config.action = n.action || undefined;
        this.config.container = n.container;

        this.on('input', (msg) => {
            let client = this.config.getClient();
            let cid = this.config.container || msg.container || undefined;
            let action = this.config.action || msg.payload || undefined;

            if (cid === undefined) {
                this.error("Container id/name must be provided via configuration or via `msg.container`");
                return;
            }

            let container = client.getContainer(cid);

            switch (action) {
                case 'start':
                    this.status({ fill: 'green', shape: 'dot', text: cid + ' started' });
                    container.start()
                        .then(res => {
                            delete msg.container;
                            delete msg.payload;
                            msg.payload = res;
                            this.send(msg);
                        }).catch(err => {
                            if (err.statusCode === 304) {
                                this.warn(`Unable to start container "${cid}", container is already started.`);
                                this.send(msg);
                            } else {
                                this.error(`Error starting container:  [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
                case 'stop':
                    this.status({ fill: 'green', shape: 'dot', text: cid + ' stopped' });
                    container.stop()
                        .then(res => {
                            delete msg.container;
                            delete msg.payload;
                            msg.payload = res;
                            this.send(msg);
                        }).catch(err => {
                            if (err.statusCode === 304) {
                                this.warn(`Unable to stop container "${cid}", container is already stopped.`);
                                this.send(msg);
                            } else {
                                this.error(`Error stopping container: [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
                default:
                    this.error(`Called with an unknown action: ${action}`);
                    return;
            }
        })
    }
    RED.nodes.registerType('docker-container-actions', DockerContainerAction);
}

