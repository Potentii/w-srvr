# AdvancedAPIConfigurator

The `AdvancedAPIConfigurator` class enables further configurations for the server routes. An instance of this configurator can be found with the [`APIConfigurator.prototype.advanced`](api-configurator.md#apiconfiguratorprototypeadvanced) property.

```javascript
const server = new Configurator();

// *Getting the advanced API configurator for the added POST route:
let advanced_configurator =
   server.api
      .post(...)
      .advanced;
```

<br><br>

## Properties

### AdvancedAPIConfigurator.prototype.headers

_Array<{ name, value }>_ \- An array containing all the registered headers

- `name` _string_ \- The header name
- `value` _string_ \- The header value

_**Note:** readonly, use the_ [_`header()`_](#advancedapiconfiguratorprototypeheadername-value) _method to set a header._

***

<br>

### AdvancedAPIConfigurator.prototype.parsers

_Array<{ type, options }>_ \- An array containing all the registered body parsers

- `type` _string_ \- The type of the parser (`json`, `text`, `raw`, or `urlencoded`)
- `options` _object_ \- The options object

_**Note:** readonly, use the following methods to configure body parsers:_

- [_AdvancedAPIConfigurator.prototype.parseJSON(options)_](#advancedapiconfiguratorprototypeparsejsonoptions)
- [_AdvancedAPIConfigurator.prototype.parseText(options)_](#advancedapiconfiguratorprototypeparsetextoptions)
- [_AdvancedAPIConfigurator.prototype.parseRaw(options)_](#advancedapiconfiguratorprototypeparserawoptions)
- [_AdvancedAPIConfigurator.prototype.parseURLEncoded(options)_](#advancedapiconfiguratorprototypeparseurlencodedoptions)

***

<br><br>

## Methods

### AdvancedAPIConfigurator.prototype.header(name, value)

Sets a header value

_**Note:** If the header is already set in this resource, its value will be replaced._

#### Parameters

- `name` _string_ \- The header name
- `value` _string_ \- The header value

#### Returns

[_AdvancedAPIConfigurator_](#) \- This same configurator (for method chaining)

#### Examples

```javascript
   // ...
   .advanced
   .header('Content-Encoding', 'gzip')
   .header('My-Custom-Header', 'some string value');
```

***

<br>

### AdvancedAPIConfigurator.prototype.allowedOrigins(origins)

Sets which origins are allowed to make CORS requests

_**Note:** It just adds an `Access-Control-Allow-Origin` header._

_**See:**_ [_Access-Control-Allow-Origin (Fetch spec.)_](https://fetch.spec.whatwg.org/#http-access-control-allow-origin)_._

_**See:**_ [_Access-Control-Allow-Origin (MDN)_](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin)_._

#### Parameters

- `origins` _...string_ \- The allowed origins

#### Returns

[AdvancedAPIConfigurator](#) \- This same configurator (for method chaining)

#### Examples

Allowing every origin to make CORS requests:

```javascript
   // ...
   .advanced
   .allowedOrigins('*');
```

Allowing only specific origins:

```javascript
   // ...
   .advanced
   .allowedOrigins('http://example.com', 'http://example2.com');
```

***

<br>

### AdvancedAPIConfigurator.prototype.allowedMethods(methods)

Sets which HTTP methods are allowed in CORS requests

_**Note:** It just adds an `Access-Control-Allow-Methods` header._

_**See:**_ [_Access-Control-Allow-Methods (Fetch spec.)_](https://fetch.spec.whatwg.org/#http-access-control-allow-methods)_._

_**See:**_ [_Access-Control-Allow-Methods (MDN)_](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods)_._

#### Parameters

- `methods` _...string_ \- The allowed methods

#### Returns

[AdvancedAPIConfigurator](#) \- This same configurator (for method chaining)

#### Examples

```javascript
   // ...
   .advanced
   .allowedMethods('PUT', 'DELETE', 'OPTIONS');
```

Using the main configurator enum:

```javascript
   // ...
   .advanced
   .allowedMethods(Configurator.METHODS.PUT, Configurator.METHODS.DELETE, Configurator.METHODS.OPTIONS);
```

***

<br>

### AdvancedAPIConfigurator.prototype.allowedHeaders(headers)

Sets which headers are allowed in CORS requests

_**Note:** It just adds an `Access-Control-Allow-Headers` header._

_**See:**_ [_Access-Control-Allow-Headers (Fetch spec.)_](https://fetch.spec.whatwg.org/#http-access-control-allow-headers)_._

_**See:**_ [_Access-Control-Allow-Headers (MDN)_](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers)_._

#### Parameters

- `headers` _...string_ \- The allowed headers names

#### Returns

[AdvancedAPIConfigurator](#) \- This same configurator (for method chaining)

#### Examples

```javascript
   // ...
   .advanced
   .allowedHeaders('Content-Type', 'My-Custom-Header');
```

***

<br>

### AdvancedAPIConfigurator.prototype.exposedHeaders(headers)

Sets which headers should be exposed in CORS responses

_**Note:** It just adds an `Access-Control-Expose-Headers` header._

_**See:**_ [_Access-Control-Expose-Headers (Fetch spec.)_](https://fetch.spec.whatwg.org/#http-access-control-expose-headers)_._

_**See:**_ [_Access-Control-Expose-Headers (MDN)_](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers)_._

#### Parameters

- `headers` _...string_ \- The exposed headers names

#### Returns

[AdvancedAPIConfigurator](#) \- This same configurator (for method chaining)

#### Examples

```javascript
   // ...
   .advanced
   .exposedHeaders('My-Custom-Header', 'Content-Length');
```

***

<br>

### AdvancedAPIConfigurator.prototype.preflightMaxAge(seconds)

Sets for how long a CORS preflight response should be cached by the client

_**Note:** It just adds an `Access-Control-Max-Age` header._

_**See:**_ [_Access-Control-Max-Age (Fetch spec.)_](https://fetch.spec.whatwg.org/#http-access-control-max-age)_._

_**See:**_ [_Access-Control-Max-Age (MDN)_](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Max-Age)_._

#### Parameters

- `seconds` _number|string_ \- The time in seconds

#### Returns

[AdvancedAPIConfigurator](#) \- This same configurator (for method chaining)

#### Examples

Set the max age to 2 hours (120 seconds):

```javascript
   // ...
   .advanced
   .preflightMaxAge(120);
```

***

<br>

### AdvancedAPIConfigurator.prototype.responseType(type)

Sets the response body type

_**Note:** It just adds a `Content-Type` header._

_**See:**_ [_Content-Type (MDN)_](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)_._

#### Parameters

- `type` _string_ \- The MIME type of the response body

#### Returns

[AdvancedAPIConfigurator](#) \- This same configurator (for method chaining)

#### Examples

```javascript
   // ...
   .advanced
   .responseType('application/json');
```

***

<br>

### AdvancedAPIConfigurator.prototype.parseJSON(options)

Enables the JSON request body parsing

_**See:**_ [_JSON parse options_](https://github.com/expressjs/body-parser#bodyparserjsonoptions)_._

#### Parameters

- `options` _object_ \- The body-parser options object

#### Returns

[AdvancedAPIConfigurator](#) \- This same configurator (for method chaining)

***

<br>

### AdvancedAPIConfigurator.prototype.parseText(options)

Enables the text request body parsing

_**See:**_ [_text parse options_](https://github.com/expressjs/body-parser#bodyparsertextoptions)_._

#### Parameters

- `options` _object_ \- The body-parser options object

#### Returns

[AdvancedAPIConfigurator](#) \- This same configurator (for method chaining)

***

<br>

### AdvancedAPIConfigurator.prototype.parseRaw(options)

Enables the raw (buffer) request body parsing

_**See:**_ [_raw parse options_](https://github.com/expressjs/body-parser#bodyparserrawoptions)_._

#### Parameters

- `options` _object_ \- The body-parser options object

#### Returns

[AdvancedAPIConfigurator](#) \- This same configurator (for method chaining)

***

<br>

### AdvancedAPIConfigurator.prototype.parseURLEncoded(options)

Enables the url-encoded request body parsing

_**See:**_ [_url-encoded parse options_](https://github.com/expressjs/body-parser#bodyparserurlencodedoptions)_._

#### Parameters

- `options` _object_ \- The body-parser options object

#### Returns

[AdvancedAPIConfigurator](#) \- This same configurator (for method chaining)

***

<br>

### AdvancedAPIConfigurator.prototype.done()

Retrieves the API configurator

#### Returns

[_APIConfigurator_](api-configurator.md) \- The API configurator (for configurator chaining)

#### Examples

```javascript
// ...
.api
   // *'APIConfigurator' instance:
   .add(...)
   .post(...)
      .advanced
      // *Inner 'AdvancedAPIConfigurator' object for the last 'POST' route:
      .header(...)
      .header(...)
      .done() // Returns the chain back to the API configurator
   .put(...)
```
