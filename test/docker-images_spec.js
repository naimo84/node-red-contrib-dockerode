var should = require("should");
var helper = require("node-red-node-test-helper");
var docker = require('dockerode-mock')


helper.init(require.resolve('node-red'));



describe('Iamges Node', function () {

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
            { id: "n1", type: "docker-images", config: "c1" }
        ];
        var dockerContainersNode = require("../dist/docker-images.js");
        var dockerConfigNode = require("../dist/docker-configuration.js");



        helper.load([dockerConfigNode, dockerContainersNode], flow, function () {
            var n1 = helper.getNode("n1");
            n1.should.have.property('type', 'docker-images');
            done();
        });
    });

   
});
