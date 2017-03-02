# Configurator

The `Configurator` class is the main resource of this project and serves as the entry point to setup the Express server.

```javascript
let configurator = new Configurator();
```

<br><br>

## Properties

### Configurator.METHODS

_object_ \- A static enum of strings that has all the supported HTTP methods names, which are `GET`, `POST`, `PUT` and `DELETE`

#### Examples

You can use it in conjunction with the api configurator to add a route middleware:

```javascript
configurator.api
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
console.log(configurator.server_port);   // Will print 80 (default port)

configurator.port(3000);                 // Will set the port to 3000
configurator.port('8080');               // Will set the port to '8080'
configurator.port(process.env.PORT);     // Will use the PORT environment variable
```

***

<br>

### Configurator.prototype.start()

Starts the server instance.

_**Note:** It will apply the settings and start the server, so it should be called after the configurations have been done._

#### Returns

[_Promise_](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) \- The promise resolves into an `{ server, address }` object, or it rejects with a `Error` if the server could not be started
- `server` [_http.Server_](https://nodejs.org/api/http.html#http_class_http_server) \- The started HTTP server
- `address` [_URL_](https://nodejs.org/api/url.html#url_url) \- The server address information

#### Examples

```javascript
configurator
   .port(3000)
   .start()    // It will commit all settings and start the server
   .then(info => console.log('Server started at ' + info.address.href))
   .catch(err => console.error(err));
```

***

<br>

### Configurator.prototype.stop()

Stops the current server instance.

_**Note:** It will end all connections remaining in the current server, and release the listened port._

#### Returns

[_Promise_](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) \- The promise resolves if everything goes ok, or it rejects with a `Error` if the server could not be stopped