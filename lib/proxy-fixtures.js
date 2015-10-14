/*jslint node : true, nomen: true, plusplus: true, vars: true, eqeq: true,*/
"use strict";
var url = require('url'),
    httpProxy = require('http-proxy');

/**
 * proxy fixtures middleware
 */
module.exports = function (opts) {

    var proxy = httpProxy.createProxyServer({target : opts.url});
    var handleError = opts.handleError === true;
    var stripPrefix = opts.stripPrefix === true;
    var reg = new RegExp('^\/' + opts.prefix.replace('/', '\/'));

    return function handler(req, res, next) {

        var parsed = url.parse(req.url);

        if (reg.test(parsed.pathname)) {
            if (stripPrefix) {
                req.url = req.url.replace('/' + opts.prefix, '');
            }

            return proxy.web(req, res, function (err) {
                if (err) {
                    console.log(err);
                }
                next(opts.handleError ? err : undefined);
            });
        }
        next();
    };
};
