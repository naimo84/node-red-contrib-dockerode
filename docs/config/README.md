---
sidebar: auto
---

### Configuration

#### docker.sock

- ***Using Node-RED in a Docker-Container***

The Node-RED container must have access to the docker.sock, so you have to add the docker-group ID to the container with 
```
docker run ... --group-add 250
```
the ID 250 may be different on your system.

#### Exposing TCP-Daemon port

- ***hostname*** hostname of docker (e.g. "localhost")
- ***port*** port of docker (e.g. "2375")

In order to expose the docker-engine TCP daemon, you have to do the following:

- ***Docker for Windows / Docker Desktop:*** 
<br>Under Settings / General check "Expose daemon on tcp://localhost:2375 without TLS"

![DockerWindowsSettings.png](https://github.com/naimo84/node-red-contrib-dockerode/raw/master/examples/DockerWindowsSettings.png)

- ***Docker-CE***

See https://success.docker.com/article/how-do-i-enable-the-remote-api-for-dockerd

or: 

```
# File: /etc/default/docker
# Use DOCKER_OPTS to modify the daemon startup options.
#DOCKER_OPTS=""
DOCKER_OPTS="-H tcp://127.0.0.1:2375 -H unix:///var/run/docker.sock"
```

or: 

```
# File: /lib/systemd/system/docker.service
ExecStart=/usr/bin/docker daemon -H fd:// -H tcp://0.0.0.0:2375
```