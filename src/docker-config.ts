import { Red } from 'node-red';
import * as Dockerode from 'dockerode';


export interface DockerConfig {
    host: string,
    port: number, action: string,
    container: string
    options: any,
    getClient(): Dockerode
}

module.exports = function (RED: Red) {


    function DockerConfig(n) {
        RED.nodes.createNode(this, n);

        let node: DockerConfig = this;
        node.host = n.host;
        node.port = n.port;
        node.options = n.options;

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
        node.getClient = (): Dockerode => {
            return new Dockerode(dockeropt);
        };
    }
    RED.nodes.registerType("docker-config", DockerConfig);

}

