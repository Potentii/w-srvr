# APIResource

Represents an API resource.

<br><br>

## Constructors

### APIResource.prototype.constructor(method, route, middleware, advanced)

Creates a new API resource

#### Parameters

- `method` _string_ \- A supported HTTP method
- `route` _string_ \- The server route
- `middleware` _function|function[]_ \- A valid Expressjs middleware function
- `advanced` [_AdvancedAPIConfigurator_](advanced-api-configurator.md) \- The advanced settings configurator

#### Throws

- _TypeError_ \- If the method is not a string
- _Error_ \- If the method is not one of the supported HTTP methods
- _TypeError_ \- If the advanced configurator is not the correct type

***

<br><br>

## Properties

### APIResource.prototype.method

_string_ \- The HTTP method

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
