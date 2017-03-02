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

_[StaticConfigurator](docs/static-configurator.md)_ \- The inner configurator for static resources

***

<br>

### Configurator.prototype.api

_[APIConfigurator](docs/api-configurator.md)_ \- The inner configurator for API routes

***

<br><br>

## Methods

### Configurator.prototype.port(port\_number)

Sets the port number of the server.

_**Note:** by default, the initial server port is `80`._

#### Parameters

- `port_number` _number|string_ \- The port number

#### Returns

_[Configurator](#)_ \- This same configurator (for method chaining)

#### Examples

```javascript
console.log(configurator.server_port);   // Will print 80 (default port)

configurator.port(3000);                 // Will set the port to 3000
configurator.port('8080');               // Will set the port to '8080'
configurator.port(process.env.PORT);     // Will use the PORT environment variable
```
