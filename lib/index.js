/*jslint node : true, nomen: true, plusplus: true, vars: true, eqeq: true,*/
"use strict";

var director = require('director'),
    union = require('union'),
    url = require('url'),
    ecstatic = require('ecstatic');

module.exports = function (options) {

    var opts = options || { fixtures: { path: './fixtures'}, 'static': {}};

    var resources = ecstatic({
        root:  opts['static'].path  || './src',
        defaultExt: 'html'
    });

    var router = new director.http.Router();

    var handler = opts.fixtures.path ? require('./local-fixtures') : require('./proxy-fixtures');

    var server = union.createServer({
        before: [
            resources,
            handler(opts.fixtures),
            function dispatch(req, res) {
                var found = router.dispatch(req, res);
                if (!found) {
                    res.emit('next');
                }
            }
        ]
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
