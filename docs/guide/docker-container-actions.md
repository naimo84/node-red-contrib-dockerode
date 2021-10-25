# docker container actions

## exec 

* POST /containers/{id}/exec [API v1.40 - ContainerExec](https://docs.docker.com/engine/api/v1.40/#operation/ContainerExec)

### Example

```json
[{"id":"d52cb21.713fc5","type":"docker-container-actions","z":"f94d0c18.dc75e","name":"docker run env","config":"380f85b7.feca6a","container":"jovial_brown","action":"run","options":"env","optionstype":"str","image":"image","imagetype":"msg","pullimage":true,"createOptions":"{\"Env\":[\"FOO=bar\",\"BAZ=quux\"]}","startOptions":"","createOptionsType":"json","startOptionsType":"json","x":360,"y":280,"wires":[["917751d3.0a969"]]},{"id":"756ba008.62f8b","type":"inject","z":"f94d0c18.dc75e","name":"msg.image=busybox","props":[{"p":"image","v":"busybox","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","x":170,"y":280,"wires":[["d52cb21.713fc5"]]},{"id":"917751d3.0a969","type":"debug","z":"f94d0c18.dc75e","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","statusVal":"","statusType":"auto","x":510,"y":280,"wires":[]},{"id":"380f85b7.feca6a","type":"docker-configuration","host":"10.0.0.185","port":"2375"}]
```

![docker-container-actions-run2.png](./docker-container-actions-run2.png)
![docker-container-actions-run.png](./docker-container-actions-run.png)