# APIResource

Represents an API resource.

<br><br>

## Constructors

### APIResource.prototype.constructor(methods, route, middleware, advanced)

Creates a new API resource

_**See:**_ [_supported HTTP methods_](configurator.md#configuratormethods)

#### Parameters

- `methods` _string|string[]_ \- One or more supported HTTP methods
- `route` _string_ \- The server route
- `middleware` _function|function[]_ \- A valid Expressjs middleware function
- `advanced` [_AdvancedAPIConfigurator_](advanced-api-configurator.md) \- The advanced settings configurator

#### Throws

- _TypeError_ \- If methods is not a string or an array of strings
- _Error_ \- If some HTTP method is not supported
- _TypeError_ \- If the advanced configurator is not the correct type

***

<br><br>

## Properties

### APIResource.prototype.methods

_string[]_ \- The list of HTTP methods

_**Note:** readonly._

***

<br>

### APIResource.prototype.route

_string_ \- The server route

_**Note:** readonly._

***

<br>

### APIResource.prototype.middleware

_function|function[]_ \- The middleware function

_**Note:** readonly._

***

<br>

### APIResource.prototype.method

_string_ \- The HTTP method

_**Note:** readonly._

***

<br>

### APIResource.prototype.advanced

[_AdvancedAPIConfigurator_](advanced-api-configurator.md) \- The advanced settings configurator

#### Throws

- _TypeError_ \- If a incorrect value type is assigned
