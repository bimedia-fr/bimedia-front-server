/*jslint node : true, nomen: true, plusplus: true, vars: true, eqeq: true,*/
"use strict";
var url = require('url'),
    httpProxy = require('http-proxy');

/**
 * local fixture middleware
 */
module.exports = function (opts) {

    var proxy = httpProxy.createProxyServer({target : opts.url});
    var handleError = opts.handleError === true;

    return function handler(req, res, next) {
        proxy.web(req, res, function (err) {
            if (err) {
                console.log(err);
            }
            next(opts.handleError ? err : undefined);
        });
    };
};
