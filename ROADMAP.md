### Docker Engine API
* GET /events
* POST /build
* POST /auth
* POST /exec-start
* POST /exec-resize
* POST /exec-json
* POST /run
* POST /info
* POST /version
* POST /ping
* POST /df
* POST /import-image

### Containers
* POST /containers/create
* POST /containers/(id or name)/resize
* POST /containers/(id or name)/start
* POST /containers/(id or name)/stop
* POST /containers/(id or name)/restart
* POST /containers/(id or name)/kill
* POST /containers/(id or name)/update
* POST /containers/(id or name)/rename
* POST /containers/(id or name)/pause
* POST /containers/(id or name)/unpause
* POST /containers/(id or name)/attach
* POST /containers/(id or name)/wait
* POST /containers/(id or name)/exec
* PUT /containers/(id or name)/archive
* GET /containers/json
* GET /containers/(id or name)/json
* GET /containers/(id or name)/top
* GET /containers/(id or name)/logs
* GET /containers/(id or name)/changes
* GET /containers/(id or name)/export
* GET /containers/(id or name)/stats
* GET /containers/(id or name)/attach/ws
* GET /containers/(id or name)/archive
* DELETE /containers/(id or name)

### Volumes
* POST /volumes/create
* GET /volumes
* GET /volumes/(name)
* DELETE /volumes/(name)

### Images
* POST /images/create
* POST /images/(name)/push
* POST /images/(name)/tag
* POST /images/load
* GET /images/json
* GET /images/(name)/json
* GET /images/(name)/history
* GET /images/search
* DELETE /images/(name)
* GET /images/(name)/get
* GET /images/get
* 
### Networks
* POST /networks/create
* POST /networks/(id or name)/connect
* POST /networks/(id or name)/disconnect
* GET /networks
* GET /networks/(id or name)
* DELETE /networks/(id or name)

### Plugins
* POST /plugins/pull?name=<plugin name>
* POST /plugins/(plugin name)/enable
* POST /plugins/(plugin name)/disable
* GET /plugins
* GET /plugins/(plugin name)
* DELETE /plugins/(plugin name)

### Nodes
* POST /nodes/(id)/update
* GET /nodes
* GET /nodes/(id or name)
* DELETE /nodes/(id or name)

### Services
* POST /services/create
* POST /services/(id)/update
* GET /services
* GET /services/(id or name)
* DELETE /services/(id or name)

### Swarm
* GET /swarm
* POST /swarm/join
* POST /swarm/leave
* POST /swarm/update
* POST /swarm/init

### Tasks
* GET /tasks
* GET /tasks/(id)