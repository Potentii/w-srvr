# APIConfigurator

The `APIConfigurator` class provides methods to handle requests to non static resources. An instance of this configurator can be found with the [`Configurator.prototype.api`](configurator.md#configuratorprototypeapi) property:

```javascript
const server = new Configurator();

// *Getting the API configurator:
let api_configurator = server.api;
```

<br><br>

## Properties

### APIConfigurator.METHODS

_**Note:** see_ [_`Configurator.METHODS`_](configurator.md#configuratormethods)_._

***

<br>

### APIConfigurator.prototype.resources

[_APIResource_](api-resource.md)_[]_ \- An array containing all the API resources

_**Note:** readonly, use the_ [_add()_](#apiconfiguratorprototypeaddmethods-route-middleware) _method to add a new resource._

***

<br>

### APIConfigurator.prototype.advanced

Starts an advanced configurator chain for the last added resource

[_AdvancedAPIConfigurator_](advanced-api-configurator.md) \- The advanced configurator of the last added route

_**Note:** Must be called only right after a route has been added._

#### Throws

- _Error_ \- If it's not being called right after a route has been added

#### Examples

```javascript
server.api
   // *Adding some GET route:
   .get(...)
      // *The following advanced chain will configure the last GET route:
      .advanced
      // *Setting some advanced configurations:
      .header(...)
      // *After the done() gets called, the chain goes back to the outer configurator again:
      .done()
   // *Continuing with the APIConfigurator:
   .put(...);

// *The following lines will throw an error,
//  as the advanced chain must be available only right after a route been added:
server.api
   .advanced;
```

***

<br><br>

## Methods

### APIConfigurator.prototype.add(methods, route, middleware)

Registers a middleware for the given route and HTTP methods

_**See:**_ [_supported HTTP methods_](configurator.md#configuratormethods)

#### Parameters

- `methods` _string|string[]_ \- One or more supported HTTP methods
- `route` _string_ \- The server route
- `middleware` _function|function[]_ \- A valid Expressjs middleware function

#### Returns

[_APIConfigurator_](#) \- This same configurator (for method chaining)

#### Throws

- _TypeError_ \- If methods is not a string or an array of strings
- _Error_ \- If some HTTP method is not supported

#### Examples

```javascript
server.api
   .add(Configurator.METHODS.POST, '/some-route', someMiddlewareFunction)
   .add('POST', '/some-other-route', someOtherMiddlewareFunction);
```

***

<br>

### APIConfigurator.prototype.get(route, middleware)

Registers a middleware for the given GET route

_**Note:** same as_ [_add()_](#apiconfiguratorprototypeaddmethods-route-middleware) _with the HTTP method set to `GET`._

#### Parameters

- `route` _string_ \- The server route
- `middleware` _function|function[]_ \- A valid Expressjs middleware function

#### Returns

[_APIConfigurator_](#) \- This same configurator (for method chaining)

***

<br>

### APIConfigurator.prototype.post(route, middleware)

Registers a middleware for the given POST route

_**Note:** same as_ [_add()_](#apiconfiguratorprototypeaddmethods-route-middleware) _with the HTTP method set to `POST`._

#### Parameters

- `route` _string_ \- The server route
- `middleware` _function|function[]_ \- A valid Expressjs middleware function

#### Returns

[_APIConfigurator_](#) \- This same configurator (for method chaining)

***

<br>

### APIConfigurator.prototype.put(route, middleware)

Registers a middleware for the given PUT route

_**Note:** same as_ [_add()_](#apiconfiguratorprototypeaddmethods-route-middleware) _with the HTTP method set to `PUT`._

#### Parameters

- `route` _string_ \- The server route
- `middleware` _function|function[]_ \- A valid Expressjs middleware function

#### Returns

[_APIConfigurator_](#) \- This same configurator (for method chaining)

***

<br>

### APIConfigurator.prototype.delete(route, middleware)

Registers a middleware for the given DELETE route

_**Note:** same as_ [_add()_](#apiconfiguratorprototypeaddmethods-route-middleware) _with the HTTP method set to `DELETE`._

#### Parameters

- `route` _string_ \- The server route
- `middleware` _function|function[]_ \- A valid Expressjs middleware function

#### Returns

[_APIConfigurator_](#) \- This same configurator (for method chaining)

***

<br>

### APIConfigurator.prototype.head(route, middleware)

Registers a middleware for the given HEAD route

_**Note:** same as_ [_add()_](#apiconfiguratorprototypeaddmethods-route-middleware) _with the HTTP method set to `HEAD`._

#### Parameters

- `route` _string_ \- The server route
- `middleware` _function|function[]_ \- A valid Expressjs middleware function

#### Returns

[_APIConfigurator_](#) \- This same configurator (for method chaining)

***

<br>

### APIConfigurator.prototype.patch(route, middleware)

Registers a middleware for the given PATCH route

_**Note:** same as_ [_add()_](#apiconfiguratorprototypeaddmethods-route-middleware) _with the HTTP method set to `PATCH`._

#### Parameters

- `route` _string_ \- The server route
- `middleware` _function|function[]_ \- A valid Expressjs middleware function

#### Returns

[_APIConfigurator_](#) \- This same configurator (for method chaining)

***

<br>

### APIConfigurator.prototype.options(route, middleware)

Registers a middleware for the given OPTIONS route

_**Note:** same as_ [_add()_](#apiconfiguratorprototypeaddmethods-route-middleware) _with the HTTP method set to `OPTIONS`._

#### Parameters

- `route` _string_ \- The server route
- `middleware` _function|function[]_ \- A valid Expressjs middleware function

#### Returns

[_APIConfigurator_](#) \- This same configurator (for method chaining)

***

<br>

### APIConfigurator.prototype.all(route, middleware)

Registers a middleware for all supported HTTP methods

_**Note:** same as_ [_add()_](#apiconfiguratorprototypeaddmethods-route-middleware) _with all the supported HTTP methods._

_**Note:** This method is **NOT** equivalent to the Expressjs's_ [_app.all()_](http://expressjs.com/en/4x/api.html#app.all)_._

_**See:**_ [_supported HTTP methods_](configurator.md#configuratormethods)

#### Parameters

- `route` _string_ \- The server route
- `middleware` _function|function[]_ \- A valid Expressjs middleware function

#### Returns

[_APIConfigurator_](#) \- This same configurator (for method chaining)

***

<br>

### APIConfigurator.prototype.most(route, middleware)

Registers a middleware for GET, POST, PUT, DELETE, HEAD and PATCH routes

_**Note:** same as_ [_add()_](#apiconfiguratorprototypeaddmethods-route-middleware) _with the HTTP method set to `GET`, `POST`, `PUT`, `DELETE`, `HEAD` and `PATCH`._

#### Parameters

- `route` _string_ \- The server route
- `middleware` _function|function[]_ \- A valid Expressjs middleware function

#### Returns

[_APIConfigurator_](#) \- This same configurator (for method chaining)

***

<br>

### APIConfigurator.prototype.done()

Retrieves the main configurator

#### Returns

[_Configurator_](configurator.md) \- The main configurator (for configurator chaining)

#### Examples

```javascript
// *Main 'Configurator' object:
server
   .port(...)
   .api
      // *Inner 'APIConfigurator' object:
      .add(...)
      .post(...)
      .put(...)
      .done()   // Returns the chain back to the main configurator
   // *Main 'Configurator' object:
   .start();
```
