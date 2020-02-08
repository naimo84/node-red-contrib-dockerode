# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.4.20](https://github.com/naimo84/node-red-contrib-dockerode/compare/v0.4.19...v0.4.20) (2020-02-08)

 * Added auto node naming. 
 * Added document links
 * Confirmed Docker API completeness. 

### [0.4.19](https://github.com/naimo84/node-red-contrib-dockerode/compare/v0.4.18...v0.4.19) (2020-02-07)

 * consolidate the action and list modules

### [0.4.18](https://github.com/naimo84/node-red-contrib-dockerode/compare/v0.4.17...v0.4.18) (2020-02-05)


### Features

* Added docker-engine-actions and docker-swarm-actions modules

### [0.4.17](https://github.com/naimo84/node-red-contrib-dockerode/compare/v0.4.10...v0.4.17) (2020-02-03)


### Bug Fixes

* dockerode 3.0.2 is not working correctly ([3bead2a](https://github.com/naimo84/node-red-contrib-dockerode/commit/3bead2ab6484c15107060d6ad8a7262c6b350b89))


### [0.4.3](https://github.com/naimo84/node-red-contrib-dockerode/compare/v0.4.2...v0.4.3) (2020-01-23)


### Bug Fixes

* dependency dockerode downgrade for compatibility ([74118f8](https://github.com/naimo84/node-red-contrib-dockerode/commit/74118f8c6142fa769ce4ffb9bb3cc783476b521e))

### [0.4.2](https://github.com/naimo84/node-red-contrib-dockerode/compare/v0.4.1...v0.4.2) (2020-01-23)


### Features

* logging config ([5957b16](https://github.com/naimo84/node-red-contrib-dockerode/commit/5957b16))

### [0.4.1](https://github.com/naimo84/node-red-contrib-dockerode/compare/v0.4.0...v0.4.1) (2020-01-23)


### Bug Fixes

* dist folder removed from gitignore ([110289b](https://github.com/naimo84/node-red-contrib-dockerode/commit/110289b))

## [0.4.0](https://github.com/naimo84/node-red-contrib-dockerode/compare/v0.3.3...v0.4.0) (2020-01-23)


### Features
* merge fork back to master ([9c30994](https://github.com/naimo84/node-red-contrib-dockerode/commit/9c309942cd5941eef898319dadb5431d6551433c))
* added: docker-config-actions, docker-configs, docker-engine-actions, docker-events, docker-image-actions, docker-network-actions, docker-networks, docker-node-actions, docker-nodes, docker-plugin-actions, docker-plugins, docker-secret-actions, docker-secrets, docker-service-actions, docker-services, docker-task-actions, docker-tasks, docker-volume-actions, docker-volumes
* removed: docker-commands, docker-inspect
* renamed: docker-config --> docker-configuration

### [0.3.3](https://github.com/naimo84/node-red-contrib-dockerode/compare/v0.3.2...v0.3.3) (2019-10-08)


### Bug Fixes

* disabled unittests ([7cd2414](https://github.com/naimo84/node-red-contrib-dockerode/commit/7cd2414))
* issue [#2](https://github.com/naimo84/node-red-contrib-dockerode/issues/2) ([6ab9f1c](https://github.com/naimo84/node-red-contrib-dockerode/commit/6ab9f1c))

### [0.3.2](https://github.com/naimo84/node-red-contrib-dockerode/compare/v0.3.1...v0.3.2) (2019-09-22)


### Features

* docker.sock  as config option implemented ([94c4121](https://github.com/naimo84/node-red-contrib-dockerode/commit/94c4121))
* standard-version ([da776e7](https://github.com/naimo84/node-red-contrib-dockerode/commit/da776e7))

### 0.3.1 (2019-09-02)

<a name="0.3.0"></a>
## [0.3.0](https://github.com/naimo84/node-red-contrib-dockerode/compare/v0.2.0...v0.3.0) (2019-08-30)

### Features

* **container-inspect:** docker inspect + extra health check 

<a name="0.2.0"></a>
## [0.2.0](https://github.com/naimo84/node-red-contrib-dockerode/compare/v0.1.2...v0.2.0) (2019-08-29)

### Features

* **container-actions:** click on container-textbox to search for containers
* **container-actions:** restart, kill, exec implemented