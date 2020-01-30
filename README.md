# node-red-contrib-dockerode

This Node RED module connects Docker with Node-RED.

> Node-RED is a tool for wiring together hardware devices, APIs and online services in new and interesting ways.

## :sparkling_heart: Support my projects

I open-source almost everything I can, and I try to reply to everyone needing help using these projects. Obviously,
this takes time. You can integrate and use these projects in your applications _for free_! You can even change the source code and redistribute (even resell it).

However, if you get some profit from this or just want to encourage me to continue creating stuff, there are few ways you can do it:

-   Starring and sharing the projects you like :rocket:
-   [![PayPal][badge_paypal]][paypal-donations] **PayPal**— You can make one-time donations via PayPal. I'll probably buy a ~~coffee~~ tea. :tea:
-   [![Support me on using Brave Browser][badge_brave]][brave] **Brave**— It's free for you. Brave is a browser that improves the security and the access time of websites by blocking ads, trackers and scripts. Give the new Brave Browser a try and Brave will contribute to me on your behalf. :wink:
-   [![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/T6T412CXA) **Ko-fi**— I'll buy a ~~tea~~ coffee. :coffee: :wink:
-   ![](./examples/bitcoin.png) **Bitcoin**—You can send me bitcoins at this address (or scanning the code): `3KDjCmXsGFYawmycXRsVwfFbphog117N8P`

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





## The MIT License
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Coded with :heart: in :it:


[badge_brave]: ./examples/support_banner.png
[badge_paypal]: https://img.shields.io/badge/Donate-PayPal-blue.svg
[paypal-donations]: https://paypal.me/NeumannBenjamin
[brave]: https://brave.com/nai412
[contributing]: /CONTRIBUTING.md