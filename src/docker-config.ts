import { Red, Node } from 'node-red';
import * as Dockerode from 'dockerode';


export interface DockerConfig{
    host:string,
    port:number,
    getClient():Dockerode
}

module.exports = function(RED:Red) {
    'use strict';
    
    function DockerConfig(n) {
        RED.nodes.createNode(this, n);
      
        let node:DockerConfig = this;
        node.host = n.host;
        node.port = n.port;

        node.getClient = ():Dockerode => {
            return new Dockerode({
                host: node.host,
                port: node.port
            });
        };
    }
    RED.nodes.registerType("docker-config", DockerConfig);
 
}

