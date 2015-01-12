bimedia-front-server
================

Bimedia Front-end test server.

## features :
* serve static assets
* static data fixtures
* http method to ressource mapping
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
Serve files like any http server

## fixtures 
The server tries to find a matching ressource in the filesystem.
Example: 

`GET /api/auth/token`

will serve file :

`$cwd/auth/token.json`



