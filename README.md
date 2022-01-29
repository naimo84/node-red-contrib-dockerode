# node-red-contrib-dockerode

This Node RED module connects Docker with Node-RED.

> Node-RED is a tool for wiring together hardware devices, APIs and online services in new and interesting ways.

<p align="center">
<a href="https://naimo84.github.io/node-red-contrib-dockerode">
    <img src="https://img.shields.io/badge/doku-naimo84.github.io-0078D6?style=for-the-badge&logo=github&logoColor=white"/>    
</a>
</p>


## :sparkling_heart: Support my projects

I open-source almost everything I can, and I try to reply to everyone needing help using these projects. Obviously,
this takes time. You can integrate and use these projects in your applications _for free_! You can even change the source code and redistribute (even resell it).

Thank you to all my backers!
### People

- [fflorent](https://github.com/fflorent)
- [Speeedy0815](https://github.com/Speeedy0815)
- Ralf S.
- Enno L.
- Jürgen G.
- Mark MC G.
- Kay-Uwe M.
- Craig O.
- Manuel G.

### Become a backer


However, if you get some profit from this or just want to encourage me to continue creating stuff, there are few ways you can do it:

- Starring and sharing the projects you like :rocket:
- **Crypto.&#65279;com** &nbsp;—&nbsp; Use my referral link https://crypto.com/app/f2smbah8fm to sign up for Crypto.&#65279;com and we both get $25 USD :)  

- [![PayPal](https://img.shields.io/badge/Donate-PayPal-blue.svg?style=for-the-badge)][paypal-donations] &nbsp; — &nbsp; You can make one-time donations via PayPal. I'll probably buy a ~~coffee~~ tea. :tea:
- [![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/T6T412CXA) &nbsp;—&nbsp; I'll buy a ~~tea~~ coffee. :coffee: :wink:

Thanks! :heart:

## :cloud: Installation

First of all install [Node-RED](http://nodered.org/docs/getting-started/installation)

## :yum: How to contribute

* git clone https://github.com/naimo84/node-red-contrib-dockerode.git
* cd node-red-contrib-dockerode
* npm install
* gulp
* cd ~/.node-red 
* npm install /path/to/node-red-contrib-dockerode

<img src="https://img.shields.io/npm/dy/node-red-contrib-dockerode?style=for-the-badge"/>

## Usage

### Configuration:

#### docker.sock

- ***Using Node-RED in a Docker-Container***

The Node-RED container must have access to the docker.sock, so you have to add the docker-group ID to the container with <pre>docker run ... --group-add 250</pre> the ID 250 may be different on your system.

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

[badge_brave]: ./examples/support_banner.png
[badge_paypal]: https://img.shields.io/badge/Donate-PayPal-blue.svg
[paypal-donations]: https://paypal.me/NeumannBenjamin

