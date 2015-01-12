bimedia-front-server
================

Bimedia Front-end test server.

## features :
* serve static assets
* static data fixtures
* http method to ressource mapping
* proxied data
* custom test routes


Example :

```js
var server = require('./test-server');
var path = require('path');

var PORT = 9090;

server({
    fixtures : {
        path : path.join(__dirname, './fixtures'),
        prefix : 'api'
    },
    'static' : {
        path : path.join(__dirname, './src')
    }
}).listen(PORT, function () {
    console.log('test server listening on port %d', PORT);
});
```
This example create a server listening on port 9090 that will serve any static resource availiable in `src` subfolder.
It will also serve JSON data availiable in `fixtures` folder for every request with the path starting with `api`.

## static assets

Serve files in `static.path` like any http server. 

## fixtures 

The server tries to find a matching ressource in the filesystem in path denoted by config `fixtures.path`.

Example: 

`GET /api/auth/token`

will serve file :

`$cwd/auth/token.json`

### method mapping

For any http method other than GET, it will append method name in lowercase at the end of requested uri.

Example: 

`POST /api/auth/token`

will serve file :

`$cwd/auth/token-post.json`

## proxied data

Fixtures can be retrieved from an url. The test server serves proxy data.

Example :

```js
var server = require('./test-server');
var path = require('path');

var PORT = 9090;

server({
    fixtures : {
        url : 'http://my.remotehost.com/fixtures',
        prefix : 'api'
    },
    'static' : {
        path : path.join(__dirname, './src')
    }
}).listen(PORT, function () {
    console.log('test server listening on port %d', PORT);
});
```

## custom test routes

Add custom route and logic with routes method.

```js
server({
    fixtures : {
        path : path.join(__dirname, './fixtures'),
        prefix : 'api'
    },
    'static' : {
        path : path.join(__dirname, './src')
    }
})function (router) {
    router.get(/api\/([0-9]{4}-[0-9]{2}-[0-9]{2})/, function (str) {
        this.res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        this.res.end(str);
    });
}.listen(PORT, function () {
    console.log('test server listening on port %d', PORT);
});
```

## based on :
* [ecstatic](https://github.com/jesusabdullah/node-ecstatic) file server.
* [union](https://github.com/flatiron/union) http server.
* [director](https://github.com/flatiron/director) router.
