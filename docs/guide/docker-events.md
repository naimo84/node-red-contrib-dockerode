# docker events

## exec 

* GET /events [API v1.40 - SystemEvents](https://docs.docker.com/engine/api/v1.40/#operation/SystemEvents)

### Example

```json
[{"id":"63862c01c25f546c","type":"docker-events","z":"f94d0c18.dc75e","name":"","config":"380f85b7.feca6a","x":490,"y":100,"wires":[["2d2994a128c2630b"],["d95d103c4357f0ca"]]},{"id":"ccfabfde3666fd3f","type":"inject","z":"f94d0c18.dc75e","name":"","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"","payloadType":"date","x":300,"y":100,"wires":[["63862c01c25f546c"]]},{"id":"7e14ef287be5bd8e","type":"debug","z":"f94d0c18.dc75e","name":"disconnected event","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","targetType":"msg","statusVal":"","statusType":"auto","x":710,"y":180,"wires":[]},{"id":"d95d103c4357f0ca","type":"delay","z":"f94d0c18.dc75e","name":"","pauseType":"delay","timeout":"5","timeoutUnits":"seconds","rate":"1","nbRateUnits":"1","rateUnits":"second","randomFirst":"1","randomLast":"5","randomUnits":"seconds","drop":false,"allowrate":false,"outputs":1,"x":480,"y":180,"wires":[["63862c01c25f546c","7e14ef287be5bd8e"]]},{"id":"2d2994a128c2630b","type":"debug","z":"f94d0c18.dc75e","name":"Events","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","targetType":"msg","statusVal":"","statusType":"auto","x":670,"y":100,"wires":[]},{"id":"380f85b7.feca6a","type":"docker-configuration","host":"10.0.0.185","port":"2375"}]
```

![docker-events.png](./docker-events.png)
