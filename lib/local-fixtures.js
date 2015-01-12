/*jslint node : true, nomen: true, plusplus: true, vars: true, eqeq: true,*/
"use strict";
var url = require('url'),
    ecstatic = require('ecstatic');

/**
 * local fixture middleware
 */
module.exports = function (opts) {

    var prefix = opts.prefix || 'api';
    var reg = new RegExp('^\/' + opts.prefix + '\/');

    var fixtures = ecstatic({
        root: opts.path || './fixtures',
        baseDir: prefix,
        defaultExt: 'json',
        handleError: false
    });

    return function handler(req, res, next) {
        var parsed = url.parse(req.url);

        if (reg.test(parsed.pathname)) {
            if (req.method !== 'GET') {
                req.url = req.url + '-' + req.method.toLowerCase();
                req.method = 'GET';
            }
            return fixtures(req, res, next);
        }
        next();
    };
};
