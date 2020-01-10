import { Red } from 'node-red';
import { OpenFaaS } from 'openfaas';

const openfaas = new OpenFaaS('http://localhost:8080')
/*
openfaas
	.deploy(
		'yolo', // name your function
		'hello-serverless', // choose the Docker image
		'func_functions' // choose your network (optional)
	)
	.then(x => console.log(x))
	.catch(err => console.log(err))
*/

/*
openfaas
	.remove('yolo')
	.then(x => console.log(x)) // handle response
	.catch(err => console.log(err))

openfaas
	.compose('initial data', [
		'func_nodeinfo',
		'func_echoit',
		'func_wordcount'
	])
	.then(x => console.log(x.body)) // handle final output
	.catch(err => console.log(err))
*/

module.exports = function (RED: Red) {
  
    function OpenFaaSInvokeNode (config) {
        RED.nodes.createNode(this, config)
        this.serverConfig = RED.nodes.getNode(config.server)
    
        if (!this.serverConfig) {
            this.error("invalid server config")
        }
        this.on('input', msg => {
            console.log(msg);
            openfaas.invoke(
                config.name, // function name
                msg.payload, // data to send to function
                false, // should response be JSON? Optional, default is false
                false // should the response by binary? Optional, default is false
            )
            .then(response => {
                console.log(response);
                msg.requestPayload = msg.payload
                msg.payload = response.data
                this.send([msg, null])
            })
            .catch(err => {
                this.send([null, err])
            })          
      })
    }
    RED.nodes.registerType('openfaas-invoke', OpenFaaSInvokeNode)
  }