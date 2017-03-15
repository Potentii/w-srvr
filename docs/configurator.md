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

### Configurator.HOOKS

_object_ \- A static enum of all the available hooks events names, which are _(in the order they're executed)_:

- `BEFORE_SETUP` \- It'll be emitted when the internal `Expressjs` instance is created, but before it gets configured
- `BEFORE_API_SETUP` \- It'll be emitted right before the `API` resources are set
- `AFTER_API_SETUP` \- It'll be emitted when all the `API` resources have been set
- `BEFORE_STATIC_SETUP` \- It'll be emitted right before the `static` resources are set
- `AFTER_STATIC_SETUP` \- It'll be emitted when all the `static` resources have been set
- `AFTER_SETUP` \- It'll be emitted when all the configurations were applied and the server is about to get initialized

_**Note:** All the hook functions will receive the `express instance`, and the `express module` as arguments._

_**Note:** You can also use the hook event name itself, they are: `'before-setup'`, `'before-api-setup'`, `'after-api-setup'`, `'before-static-setup'`, `'after-static-setup'` and `'after-setup'`._

#### Examples

Using with the [`Configurator.prototype.on(event, listener)`](#configuratorprototypeonevent-listener) to register hook functions:

```javascript
server
   .on(Configurator.HOOKS.BEFORE_API_SETUP, (app, express) => {
      // *Do something cool...
   })
   .on('before-api-setup', (app, express) => {
      // *Do something cool here...
   });
```

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

### Configurator.prototype.notFound(middleware)

Registers middlewares to handle 404 responses.

_**Note:** it can be used to send custom 404 pages or API responses._

_**Note:** you can call this method multiple times to add more middlewares, but you can also simply pass an array of middlewares._

#### Parameters

- `middleware` _function|function[]_ \- A valid Expressjs middleware function

#### Returns

[_Configurator_](#) \- This same configurator (for method chaining)

#### Examples

```javascript
server
   .notFound((req, res, next) => {
      // *Do something cool here...
   });
```

***

<br>

### Configurator.prototype.on(event, listener)

Registers a handler for a given event.

_**Note:** it can be used to configure hook functions._

_**See:**_ [_`Configurator.HOOKS`_](#configuratorhooks) _for all the hooks events available._

#### Parameters

- `event` _string_ \- The event name
- `listener` _function_ \- The handler function

#### Returns

[_Configurator_](#) \- This same configurator (for method chaining)

#### Examples

```javascript
server
   .on('before-api-setup', (app, express) => {
      // *Do something cool here...
   });
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
