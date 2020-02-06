### System
* POST /auth [API v1.40 - SystemAuth](https://docs.docker.com/engine/api/v1.40/#operation/SystemAuth)
* POST /info [API v1.40 - SystemInfo](https://docs.docker.com/engine/api/v1.40/#operation/SystemInfo)
* POST /version [API v1.40 - SystemVersion](https://docs.docker.com/engine/api/v1.40/#operation/SystemVersion)
* POST /_ping [API v1.40 - SystemPing](https://docs.docker.com/engine/api/v1.40/#operation/SystemPing)
* HEAD /_ping [API v1.40 - SystemPingHead](https://docs.docker.com/engine/api/v1.40/#operation/SystemPingHead)
* GET /events [API v1.40 - SystemEvents](https://docs.docker.com/engine/api/v1.40/#operation/SystemEvents)
* GET /system/df [API v1.40 - SystemDataUsage](https://docs.docker.com/engine/api/v1.40/#operation/SystemDataUsage)
* ## TODO:
* * Test

### Distribution
GET /distribution/{name}/json [API v1.40 - DistributionInspect](https://docs.docker.com/engine/api/v1.40/#operation/DistributionInspect)
* ## TODO:
* * Test

### Session
* POST /session [API v1.40 - Session](https://docs.docker.com/engine/api/v1.40/#operation/Session)
* ## TODO:
* * Test

### Containers
* GET /containers/json [API v1.40 - ContainerList](https://docs.docker.com/engine/api/v1.40/#operation/ContainerList)

* POST /containers/create [API v1.40 - ContainerCreate](https://docs.docker.com/engine/api/v1.40/#operation/ContainerCreate)
* * Locate or implement
* GET /containers/(id or name)/json [API v1.40 - ContainerInspect](https://docs.docker.com/engine/api/v1.40/#operation/ContainerInspect)
* * ~~Errors~~
* * ~~Tested~~ 
* GET /containers/(id or name)/top [API v1.40 - ContainerTop](https://docs.docker.com/engine/api/v1.40/#operation/ContainerTop)
* * ~~Errors~~
* * ~~Tested~~ 
* GET /containers/(id or name)/logs [API v1.40 - ContainerLogs](https://docs.docker.com/engine/api/v1.40/#operation/ContainerLogs)
* * ~~Errors~~
* * Failed
* GET /containers/(id or name)/changes [API v1.40 - ContainerChanges](https://docs.docker.com/engine/api/v1.40/#operation/ContainerChanges)
* * ~~Errors~~
* * ~~Tested~~ 
* GET /containers/(id or name)/export  [API v1.40 - ContainerExport](https://docs.docker.com/engine/api/v1.40/#operation/ContainerExport)
* * ~~Errors~~
* * Failed
* GET /containers/(id or name)/stats [API v1.40 - ContainerStats](https://docs.docker.com/engine/api/v1.40/#operation/ContainerStats)
* * ~~Errors~~
* * Failed
* POST /containers/{id}/resize [API v1.40 - ](https://docs.docker.com/engine/api/v1.40/#operation/ContainerResize)
* * ~~Errors~~
* * Failed
* POST /containers/(id or name)/start [API v1.40 - ContainerResize](https://docs.docker.com/engine/api/v1.40/#operation/ContainerStart)
* * ~~Errors~~
* * Failed  Odd messge
* POST /containers/(id or name)/stop [API v1.40 - ContainerStop](https://docs.docker.com/engine/api/v1.40/#operation/ContainerStop)
* * ~~Errors~~
* * Failed  Odd messge
* POST /containers/(id or name)/restart [API v1.40 - ](https://docs.docker.com/engine/api/v1.40/#operation/ContainerRestart)
* * ~~Errors~~
* * Failed  Odd messge
* POST /containers/(id or name)/kill [API v1.40 - ](https://docs.docker.com/engine/api/v1.40/#operation/ContainerKill)
* * ~~Errors~~
* * Failed Odd messge
* POST /containers/(id or name)/update [API v1.40 - ContainerKill](https://docs.docker.com/engine/api/v1.40/#operation/ContainerUpdate)
* * ~~Errors~~
* * Failed Odd messge
* POST /containers/(id or name)/rename [API v1.40 - ContainerRename](https://docs.docker.com/engine/api/v1.40/#operation/ContainerRename)
* * ~~Errors~~
* * Failed Odd messge
* POST /containers/(id or name)/pause [API v1.40 - ContainerPause](https://docs.docker.com/engine/api/v1.40/#operation/ContainerPause)
* * ~~Errors~~
* * Failed Odd messge
* POST /containers/(id or name)/unpause [API v1.40 - ContainerUnpause](https://docs.docker.com/engine/api/v1.40/#operation/ContainerUnpause)
* * ~~Errors~~
* * Failed Odd messge
* POST /containers/(id or name)/attach [API v1.40 - ](https://docs.docker.com/engine/api/v1.40/#operation/ContainerAttach)
* * ~~Errors~~
* * Failed Odd messge
* GET /containers/{id}/attach/ws [API v1.40 - ContainerAttach](https://docs.docker.com/engine/api/v1.40/#operation/ContainerAttachWebsocket)
* * ~~Errors~~
* * Failed Odd messge
* * Not found in dockerode
* POST /containers/(id or name)/wait [API v1.40 - ContainerWait](https://docs.docker.com/engine/api/v1.40/#operation/ContainerWait)
* * ~~Errors~~
* * Failed Odd messge
* DELETE /containers/(id or name) [API v1.40 - ContainerDelete](https://docs.docker.com/engine/api/v1.40/#operation/ContainerDelete)
* * ~~Errors~~
* * Failed Odd messge
* HEAD /containers/{id}/archive [API v1.40 - ContainerArchiveInfo](https://docs.docker.com/engine/api/v1.40/#operation/ContainerArchiveInfo)
* * ~~Errors~~
* * Failed Odd messge
* PUT /containers/(id or name)/archive [API v1.40 - ContainerArchive](https://docs.docker.com/engine/api/v1.40/#operation/ContainerArchive)
* * ~~Errors~~
* * Fix and test
* POST /containers/prune [API v1.40 - ContainerPrune](https://docs.docker.com/engine/api/v1.40/#operation/ContainerPrune)
* * Not found in dockerode
* ## TODO:
* * Test

### Exec
* POST /containers/{id}/exec [API v1.40 - ContainerExec](https://docs.docker.com/engine/api/v1.40/#operation/ContainerExec)
* POST /exec/{id}/start [API v1.40 - ExecStart](https://docs.docker.com/engine/api/v1.40/#operation/ExecStart)
* POST /exec/{id}/resize [API v1.40 - ExecResize](https://docs.docker.com/engine/api/v1.40/#operation/ExecResize)
* GET /exec/{id}/json [API v1.40 - ExecInspect](https://docs.docker.com/engine/api/v1.40/#operation/ExecInspect)
* ## TODO:
* * Test

### Volumes
* GET /volumes [API v1.40 - VolumeList](https://docs.docker.com/engine/api/v1.40/#operation/VolumeList)
* POST /volumes/create [API v1.40 - VolumeCreate](https://docs.docker.com/engine/api/v1.40/#operation/VolumeCreate)
* GET /volumes/(name) [API v1.40 - VolumeInspect](https://docs.docker.com/engine/api/v1.40/#operation/VolumeInspect)
* DELETE /volumes/(name) [API v1.40 - VolumeDelete](https://docs.docker.com/engine/api/v1.40/#operation/VolumeDelete)
* POST /volumes/prune [API v1.40 - VolumePrune](https://docs.docker.com/engine/api/v1.40/#operation/VolumePrune)
* ## TODO:
* * Test

### Images
* GET /images/json [API v1.40 - ImageList](https://docs.docker.com/engine/api/v1.40/#operation/ImageList)
* POST /build [API v1.40 - ImageBuild](https://docs.docker.com/engine/api/v1.40/#operation/ImageBuild)
* POST /build/prune [API v1.40 - BuildPrune](https://docs.docker.com/engine/api/v1.40/#operation/BuildPrune)
* POST /images/create [API v1.40 - ImageCreate](https://docs.docker.com/engine/api/v1.40/#operation/ImageCreate)
* GET /images/(name)/json [API v1.40 - ImageInspect](https://docs.docker.com/engine/api/v1.40/#operation/ImageInspect)
* GET /images/(name)/history [API v1.40 - ImageHistory](https://docs.docker.com/engine/api/v1.40/#operation/ImageHistory)
* POST /images/(name)/push [API v1.40 - ImagePush](https://docs.docker.com/engine/api/v1.40/#operation/ImagePush)
* POST /images/(name)/tag [API v1.40 - ImageTag](https://docs.docker.com/engine/api/v1.40/#operation/ImageTag)
* DELETE /images/(name) [API v1.40 - ImageDelete](https://docs.docker.com/engine/api/v1.40/#operation/ImageDelete)
* GET /images/search [API v1.40 - ImageSearch](https://docs.docker.com/engine/api/v1.40/#operation/ImageSearch)
* POST /images/prune [API v1.40 - ImagePrune](https://docs.docker.com/engine/api/v1.40/#operation/ImagePrune)
* POST /commit [API v1.40 - ImageCommit](https://docs.docker.com/engine/api/v1.40/#operation/ImageCommit)
* GET /images/(name)/get  [API v1.40 - ](https://docs.docker.com/engine/api/v1.40/#operation/ImageGet)
* GET /images/get [API v1.40 - ImageGet](https://docs.docker.com/engine/api/v1.40/#operation/ImageGetAll)
* POST /images/load [API v1.40 - ImageLoad](https://docs.docker.com/engine/api/v1.40/#operation/ImageLoad)
* ## TODO:
* * Test

### Networks
* GET /networks [API v1.40 - NetworkList](https://docs.docker.com/engine/api/v1.40/#operation/NetworkList)
* GET /networks/(id or name) [API v1.40 - NetworkInspect](https://docs.docker.com/engine/api/v1.40/#operation/NetworkInspect)
* DELETE /networks/(id or name) [API v1.40 - NetworkDelete](https://docs.docker.com/engine/api/v1.40/#operation/NetworkDelete)
* POST /networks/create [API v1.40 - NetworkCreate](https://docs.docker.com/engine/api/v1.40/#operation/NetworkCreate)
* POST /networks/(id or name)/connect [API v1.40 - NetworkConnect](https://docs.docker.com/engine/api/v1.40/#operation/NetworkConnect)
* POST /networks/(id or name)/disconnect [API v1.40 - NetworkDisconnect](https://docs.docker.com/engine/api/v1.40/#operation/NetworkDisconnect)
* POST /networks/prune [API v1.40 - NetworkPrune](https://docs.docker.com/engine/api/v1.40/#operation/NetworkPrune)
* ## TODO:
* * Test

### Plugins
* GET /plugins [API v1.40 - PluginList](https://docs.docker.com/engine/api/v1.40/#operation/PluginList)
* GET /plugins/privileges [API v1.40 - GetPluginPrivileges](https://docs.docker.com/engine/api/v1.40/#operation/GetPluginPrivileges)
* POST /plugins/pull [API v1.40 - PluginPull](https://docs.docker.com/engine/api/v1.40/#operation/PluginPull)
* GET /plugins/{name}/json [API v1.40 - PluginInspect](https://docs.docker.com/engine/api/v1.40/#operation/PluginInspect)
* DELETE /plugins/{name} [API v1.40 - PluginDelete](https://docs.docker.com/engine/api/v1.40/#operation/PluginDelete)
* POST /plugins/{name}/enable [API v1.40 - PluginEnable](https://docs.docker.com/engine/api/v1.40/#operation/PluginEnable)
* POST /plugins/{name}/disable [API v1.40 - PluginDisable](https://docs.docker.com/engine/api/v1.40/#operation/PluginDisable)
* POST /plugins/{name}/upgrade [API v1.40 - PluginUpgrade](https://docs.docker.com/engine/api/v1.40/#operation/PluginUpgrade)
* POST /plugins/create [API v1.40 - PluginCreate](https://docs.docker.com/engine/api/v1.40/#operation/PluginCreate)
* POST /plugins/{name}/push [API v1.40 - PluginPush](https://docs.docker.com/engine/api/v1.40/#operation/PluginPush)
* POST /plugins/{name}/set [API v1.40 - PluginSet](https://docs.docker.com/engine/api/v1.40/#operation/PluginSet)
* ## TODO:
* * Test

### Configs
* GET /configs [API v1.40 - ConfigList](https://docs.docker.com/engine/api/v1.40/#operation/ConfigList)
* POST /configs/create [API v1.40 - ConfigCreate](https://docs.docker.com/engine/api/v1.40/#operation/ConfigCreate)
* * ~~Errors~~
* * ~~Tested~~ 
* GET /configs/{id} [API v1.40 - ConfigInspect](https://docs.docker.com/engine/api/v1.40/#operation/ConfigInspect)
* * ~~Errors~~
* DELETE /configs/{id} [API v1.40 - ConfigDelete](https://docs.docker.com/engine/api/v1.40/#operation/ConfigDelete)
* * ~~Errors~~
* POST /configs/{id}/update [API v1.40 - ConfigUpdate](https://docs.docker.com/engine/api/v1.40/#operation/ConfigUpdate)
* * ~~Errors~~
* ## TODO:
* * Test

### Secrets
* GET /secrets [API v1.40 - SecretList](https://docs.docker.com/engine/api/v1.40/#operation/SecretList)
* POST /secrets/create [API v1.40 - SecretCreate](https://docs.docker.com/engine/api/v1.40/#operation/SecretCreate)
* GET /secrets/{id} [API v1.40 - SecretInspect](https://docs.docker.com/engine/api/v1.40/#operation/SecretInspect)
* DELETE /secrets/{id} [API v1.40 - SecretDelete](https://docs.docker.com/engine/api/v1.40/#operation/SecretDelete)
* POST /secrets/{id}/update [API v1.40 - SecretUpdate](https://docs.docker.com/engine/api/v1.40/#operation/SecretUpdate)
* ## TODO:
* * Test

### Nodes
* GET /nodes [API v1.40 - NodeList](https://docs.docker.com/engine/api/v1.40/#operation/NodeList)
* GET /nodes/{id} [API v1.40 - NodeInspect](https://docs.docker.com/engine/api/v1.40/#operation/NodeInspect)
* DELETE /nodes/{id} [API v1.40 - NodeDelete](https://docs.docker.com/engine/api/v1.40/#operation/NodeDelete)
* POST /nodes/{id}/update [API v1.40 - NodeUpdate](https://docs.docker.com/engine/api/v1.40/#operation/NodeUpdate)
* ## TODO:
* * Test

### Services
* GET /services [API v1.40 - ServiceCreate](https://docs.docker.com/engine/api/v1.40/#operation/c)
* POST /services/create [API v1.40 - ServiceCreate](https://docs.docker.com/engine/api/v1.40/#operation/ServiceCreate)
* GET /services/{id} [API v1.40 - ServiceInspect](https://docs.docker.com/engine/api/v1.40/#operation/ServiceInspect)
* DELETE /services/{id} [API v1.40 - ServiceDelete](https://docs.docker.com/engine/api/v1.40/#operation/ServiceDelete)
* POST /services/{id}/update [API v1.40 - ServiceUpdate](https://docs.docker.com/engine/api/v1.40/#operation/ServiceUpdate)
* ## TODO:
* * Test

### Swarm
* GET /swarm [API v1.40 - Swarm](https://docs.docker.com/engine/api/v1.40/#tag/Swarm)
* POST /swarm/init [API v1.40 - SwarmInit](https://docs.docker.com/engine/api/v1.40/#operation/SwarmInit)
* POST /swarm/join [API v1.40 - SwarmJoin](https://docs.docker.com/engine/api/v1.40/#operation/SwarmJoin)
* POST /swarm/leave [API v1.40 - SwarmLeave](https://docs.docker.com/engine/api/v1.40/#operation/SwarmLeave)
* POST /swarm/update [API v1.40 - SwarmUpdate](https://docs.docker.com/engine/api/v1.40/#operation/SwarmUpdate)
* ## TODO:
* * Test

### Tasks
* GET /tasks [API v1.40 - TaskList](https://docs.docker.com/engine/api/v1.40/#operation/TaskList)
* GET /tasks/(id) [API v1.40 - TaskInspect](https://docs.docker.com/engine/api/v1.40/#operation/TaskInspect)
* GET /tasks/{id}/logs [API v1.40 - TaskLogs](https://docs.docker.com/engine/api/v1.40/#operation/TaskLogs)
* ## TODO:
* * Test
