import { Red, Node } from 'node-red';
import { DockerConfiguration } from './docker-configuration';
import * as Dockerode from 'dockerode';

module.exports = function (RED: Red) {
 
    function DockerSecretAction(n: any) {
        RED.nodes.createNode(this, n);
        let config = RED.nodes.getNode(n.config) as unknown as DockerConfiguration;
        let client = config.getClient();
        this.on('input', (msg) => {

            let secretId: string = n.secretId || msg.payload.secretId || msg.secretId || undefined;
            //TODO: make this disabled by default
            let action = n.action || msg.action || msg.payload.action || undefined;

            if (secretId === undefined && !['list'].includes(action)) {
                this.error("Secret id/name must be provided via configuration or via `msg.secret`");
                return;
            }
            this.status({});
            executeAction(secretId, client, action, this,msg);
        });

        function executeAction(secretId: string, client: Dockerode, action: string, node: Node,msg) {

            let secret = client.getSecret(secretId);

            switch (action) {

                case 'list':
                    // https://docs.docker.com/engine/api/v1.40/#operation/SecretList
                    client.listSecrets({ all: true })
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: secretId + ' started' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 400) {
                                node.error(`Bad parameter:  ${err.reason}`);
                                node.send({ payload: err });
                            } else if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Sytem Error:  [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;

                case 'inspect':
                    secret.inspect()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: secretId + ' started' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Sytem Error:  [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
                case 'remove':
                    secret.remove()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: secretId + ' stopped' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Sytem Error:  [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
                case 'update':
                    secret.update()
                        .then(res => {
                            node.status({ fill: 'green', shape: 'dot', text: secretId + ' restarted' });
                            node.send(Object.assign(msg,{ payload: res }));
                        }).catch(err => {
                            if (err.statusCode === 500) {
                                node.error(`Server Error: [${err.statusCode}] ${err.reason}`);
                                node.send({ payload: err });
                            } else {
                                node.error(`Sytem Error:  [${err.statusCode}] ${err.reason}`);
                                return;
                            }
                        });
                    break;
                default:
                    node.error(`Called with an unknown action: ${action}`);
                    return;
            }
        }
    }

    RED.nodes.registerType('docker-secret-actions', DockerSecretAction);
}

