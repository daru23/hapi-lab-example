
var Hapi = require('hapi'),
    Good = require('good'),
    config = require("./config.json");


var server = new Hapi.Server();
server.connection({
    host: config.server.host,
    port: config.server.port
});


/* http://domain/ */
server.route({
    method: 'GET',
    path: '/',
    handler: function(request, response){
        response('Hello, babe!');
    }
});

/* Route http://domain/some_name */
server.route({
    method: 'GET',
    path:'/{name}',
    handler: function(request, response){
        response('Hello, ' + encodeURIComponent(request.params.name) + '!');
    }
});

var options = {
    opsInterval: 1000,
    reporters: [{
        reporter: require('good-console'),
        events: { log: '*', response: '*' }
    }, {
        reporter: require('good-file'),
        events: { ops: '*' },
        config: './test/fixtures/awesome_log'
    }, {
        reporter: 'good-http',
        events: { error: '*' },
        config: {
            endpoint: 'http://prod.logs:3000',
            wreck: {
                headers: { 'x-api-key' : 12345 }
            }
        }
    }]
};


server.register({

    register: Good,
    options: options

}, function (err) {
    if (err){
        throw err; // if something goes wrong with the plugin
    }

    server.start(function () {
        server.log('info', 'Server running at: '+ server.info.uri);
    })
});
