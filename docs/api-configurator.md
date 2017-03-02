# APIConfigurator

The `APIConfigurator` class provides methods to handle requests to non static resources. An instance of this configurator can be found with the [`Configurator.prototype.api`](configurator.md#configuratorprototypeapi) property:

```javascript
let configurator = new Configurator();

// *Getting the api configurator:
let api_configurator = configurator.api;
```

<br><br>

## Properties

### APIConfigurator.METHODS

_**Note:** see_ [_`Configurator.METHODS`_](configurator.md#configuratormethods)_._

***

<br>

### APIConfigurator.prototype.resources

_Array<{ method, route, middleware }>_ \- An array containing all the API resources
- `method` _string_ \- One of the supported HTTP methods
- `route` _string_ \- The server route
- `middleware` _string_ \- An Expressjs middleware function

_**Note:** readonly, use the_ [_`add()`_](#apiconfiguratorprototypeaddmethod-route-middleware) _method to add a new resource._


***

<br><br>

## Methods

### APIConfigurator.prototype.add(method, route, middleware)

Registers a middleware for the given route and HTTP method

#### Parameters

- `method` _string_ \- A supported HTTP method
- `route` _string_ \- The server route
- `middleware` _function|function[]_ \- A valid Expressjs middleware function

#### Returns

[_APIConfigurator_](#) \- This same configurator (for method chaining)

#### Throws

- _TypeError_ \- If the method is not a string
- _Error_ \- If the method is not one of the supported HTTP methods

#### Examples

```javascript
configurator.api
   .add(Configurator.METHODS.POST, '/some-route', someMiddlewareFunction)
   .add('POST', '/some-other-route', someOtherMiddlewareFunction);
```

***

<br>

### APIConfigurator.prototype.get(route, middleware)

Registers a middleware for the given GET route

_**Note:** same as [add()](#apiconfiguratorprototypeaddmethod-route-middleware) with the HTTP method set to `GET`._

#### Parameters

- `route` _string_ \- The server route
- `middleware` _function|function[]_ \- A valid Expressjs middleware function

#### Returns

[_APIConfigurator_](#) \- This same configurator (for method chaining)

***

<br>

### APIConfigurator.prototype.post(route, middleware)

Registers a middleware for the given POST route

_**Note:** same as [add()](#apiconfiguratorprototypeaddmethod-route-middleware) with the HTTP method set to `POST`._

#### Parameters

- `route` _string_ \- The server route
- `middleware` _function|function[]_ \- A valid Expressjs middleware function

#### Returns

[_APIConfigurator_](#) \- This same configurator (for method chaining)

***

<br>

### APIConfigurator.prototype.put(route, middleware)

Registers a middleware for the given PUT route

_**Note:** same as [add()](#apiconfiguratorprototypeaddmethod-route-middleware) with the HTTP method set to `PUT`._

#### Parameters

- `route` _string_ \- The server route
- `middleware` _function|function[]_ \- A valid Expressjs middleware function

#### Returns

[_APIConfigurator_](#) \- This same configurator (for method chaining)

***

<br>

### APIConfigurator.prototype.delete(route, middleware)

Registers a middleware for the given DELETE route

_**Note:** same as [add()](#apiconfiguratorprototypeaddmethod-route-middleware) with the HTTP method set to `DELETE`._

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
configurator
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
