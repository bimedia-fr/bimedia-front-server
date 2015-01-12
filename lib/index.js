/*jslint node : true, nomen: true, plusplus: true, vars: true, eqeq: true,*/
"use strict";

var director = require('director'),
    union = require('union'),
    url = require('url'),
    ecstatic = require('ecstatic');

module.exports = function (options) {

    var opts = options || { fixtures: {}, 'static': {}};
    var prefix = opts.fixtures.prefix || 'api';

    var fixtures = ecstatic({
        root: opts.fixtures.path || './fixtures',
        baseDir: prefix,
        defaultExt: 'json',
        handleError: false
    });

    var resources = ecstatic({
        root:  opts['static'].path  || './src',
        defaultExt: 'html'
    });

    var reg = new RegExp('^\/' + prefix + '\/');

    function handler(req, res, next) {
        var parsed = url.parse(req.url);

        if (reg.test(parsed.pathname)) {
            if (req.method !== 'GET') {
                req.url = req.url + '-' + req.method.toLowerCase();
                req.method = 'GET';
            }
            return fixtures(req, res, next);
        }
        next();
    }

    var router = new director.http.Router();

    var server = union.createServer({
        before: [
            resources,
            handler,
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
