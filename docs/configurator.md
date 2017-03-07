# Configurator

The `Configurator` class is the main resource of this project and serves as the entry point to setup the Express server.

```javascript
const server = new Configurator();
```

<br><br>

## Properties

### Configurator.METHODS

_object_ \- A static enum of strings that has all the supported HTTP methods names, which are `GET`, `POST`, `PUT`, `DELETE`, `HEAD`, `PATCH` and `OPTIONS`

#### Examples

You can use it with the API configurator to add a route middleware:

```javascript
server.api
   .add(Configurator.METHODS.GET, '/some-route', someMiddlewareFunction);
```

This will register a middleware for a `GET` request on `'/some-route'`.

***

<br>

### Configurator.prototype.server\_port

_number|string_ \- The server port

_**Note:** readonly, use the_ [_`port()`_](#configuratorprototypeportport_number) _method to assign a new value._

***

<br>

### Configurator.prototype.static

[_StaticConfigurator_](static-configurator.md) \- The inner configurator for static resources

***

<br>

### Configurator.prototype.api

[_APIConfigurator_](api-configurator.md) \- The inner configurator for API routes

***

<br><br>

## Methods

### Configurator.prototype.port(port\_number)

Sets the port number of the server.

_**Note:** by default, the initial server port is `80`._

#### Parameters

- `port_number` _number|string_ \- The port number

#### Returns

[_Configurator_](#) \- This same configurator (for method chaining)

#### Examples

```javascript
console.log(server.server_port);   // Will print 80 (default port)

server.port(3000);                 // Will set the port to 3000
server.port('8080');               // Will set the port to '8080'
server.port(process.env.PORT);     // Will use the PORT environment variable
```

***

<br>

### Configurator.prototype.start()

Starts the server instance.

_**Note:** It will apply the settings and start the server, so it should be called after the configurations have been done._

_**Note:** These are the actions done in order to start the web server:_

- For each API resource:
 - Set parsers
 - Set preflight headers (in an `OPTIONS` middleware)
 - Set other headers
 - Set the middlewares

- For each static resource:
 - Set a static `GET` middleware

- Set the index page on the root route (`/`)
- Set an auto `404` response middleware

#### Returns

[_Promise_](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise)_<{ server, address }>_ \- The promise resolves into an `{ server, address }` object, or it rejects with a `Error` if the server could not be started:
- `server` [_http.Server_](https://nodejs.org/api/http.html#http_class_http_server) \- The started HTTP server
- `address` [_URL_](https://nodejs.org/api/url.html#url_url) \- The server address information

#### Examples

```javascript
server
   .port(3000)
   .start()    // It will commit all settings and start the server
   .then(output => console.log('Server started at ' + output.address.href))
   .catch(err => console.error(err));
```

***

<br>

### Configurator.prototype.stop()

Stops the current server instance.

_**Note:** It will end all connection sockets remaining in the current server, and release the listened port._

#### Returns

[_Promise_](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) \- The promise resolves if everything goes ok, or it rejects with a `Error` if the server could not be stopped
