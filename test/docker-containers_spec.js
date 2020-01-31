var should = require("should");
var helper = require("node-red-node-test-helper");
var docker = require('dockerode-mock')


helper.init(require.resolve('node-red'));



describe('Containers Node', function () {

    beforeEach(function (done) {
        helper.startServer(done);
    });

    afterEach(function (done) {
        helper.unload().then(function () {
            helper.stopServer(done);
        });
    });

    it('should be loaded', function (done) {
        var flow = [
            { id: "c1", type: "docker-configuration" },
            { id: "n1", type: "docker-containers", config: "c1" }
        ];
        var dockerContainersNode = require("../dist/docker-containers.js");
        var dockerConfigNode = require("../dist/docker-configuration.js");



        helper.load([dockerConfigNode, dockerContainersNode], flow, function () {
            var n1 = helper.getNode("n1");
            n1.should.have.property('type', 'docker-containers');
            done();
        });
    });

    // it('should return docker container', function (done) {
    //     docker.overrides = {
    //         'GET /_ping': { error: 'connection error' },
    //         'GET /containers/json?': {},
    //     }

    //     var flow = [
    //         {
    //             "id": "n2",
    //             "type": "helper"
    //         },
    //         {
    //             "id": "dc1",
    //             "type": "docker-containers",
    //             "config": "c1",
    //             "wires": [
    //                 [
    //                     "n2"
    //                 ]
    //             ]
    //         },
    //         {
    //             "id": "c1",
    //             "type": "docker-configuration",
    //             "host": "localhost",
    //             "port": "2375"
    //         }
    //     ];

    //     var dockerContainersNode = require("../dist/docker-containers.js");
    //     var dockerConfigNode = require("../dist/configuration.js");

    //     helper.load([dockerConfigNode, dockerContainersNode], flow, function () {
    //         try {
    //             var n2 = helper.getNode("n2");
    //             var dc1 = helper.getNode("dc1");
    //             dc1.receive({ payload: "" });
    //             n2.on("input", function (msg) {   
    //                 msg.should.not.be.empty();                    
    //                 done();
    //             });
               
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     });
    // });
});
