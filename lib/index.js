/*jslint node : true, nomen: true, plusplus: true, vars: true, eqeq: true,*/
"use strict";

var director = require('director'),
    union = require('union'),
    url = require('url'),
    ecstatic = require('ecstatic'),
    local = require('./local-fixtures'),
    proxy = require('./proxy-fixtures');

module.exports = function (options) {

    var opts = options || { fixtures: { path: './fixtures'}, 'static': {}};

    var resources = ecstatic({
        root:  opts['static'].path  || './src',
        defaultExt: 'html'
    });

    var router = new director.http.Router();

    if (!Array.isArray(opts.fixtures)) {
        opts.fixtures = [opts.fixtures];
    }

    var handlers =  opts.fixtures.map(function (config) {
        return config.path ? local(config) : proxy(config);
    });

    handlers.unshift(resources);
    handlers.push(function dispatch(req, res) {
        var found = router.dispatch(req, res);
        if (!found) {
            res.emit('next');
        }
    });

    var server = union.createServer({
        before: handlers
    });

    var self = {
        routes : function (fn) {
            fn(router);
            return self;
        },
        listen : server.listen.bind(server)
    };

    return self;
};
