import { Red } from 'node-red';
import { readFileSync } from 'fs';
import * as Dockerode from 'dockerode';


export interface DockerConfiguration {
    host: string
    ca: string
    cert: string
    key: string
    port: number
    action: string
    container: string
    options: any
    getClient(): Dockerode
}

module.exports = function (RED: Red) {


    function DockerConfiguration(n) {
        RED.nodes.createNode(this, n);

        let node: DockerConfiguration = this;
        node.host = n.host;
        node.port = n.port || "2375";
        node.options = n.options;
        node.ca = n.ca;
        node.key = n.key;
        node.cert = n.cert;

        node.getClient = (): Dockerode => {
            let dockeropt = {};

            if (node.host.includes("docker.sock")) {
                dockeropt = {
                    socketPath: node.host
                }
            } else {
                dockeropt = {
                    host: node.host,
                    port: node.port
                }
            }

            if (node.ca) {
                dockeropt = Object.assign(dockeropt, {
                    ca: readFileSync(node.ca)
                })
            }
            if (node.key) {
                dockeropt = Object.assign(dockeropt, {
                    key: readFileSync(node.key)
                })
            }
            if (node.cert) {
                dockeropt = Object.assign(dockeropt, {
                    cert: readFileSync(node.cert)
                })
            }
            return new Dockerode(dockeropt);
        };
    }
    RED.nodes.registerType("docker-configuration", DockerConfiguration);

}

