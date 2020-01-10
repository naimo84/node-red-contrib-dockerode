import { Red } from 'node-red';

module.exports = function (RED: Red) {
  
    function OpenFaaSServerNode (config) {
      RED.nodes.createNode(this, config)
      this.endpoint = config.endpoint
    }
    RED.nodes.registerType('openfaas-server', OpenFaaSServerNode)

  }