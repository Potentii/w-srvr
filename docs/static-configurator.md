# StaticConfigurator

The `StaticConfigurator` class provides methods to register static resources in the server as well as an index page. An instance of this configurator can be found with the [`Configurator.prototype.static`](configurator.md#configuratorprototypestatic) property:

```javascript
const server = new Configurator();

// *Getting the static configurator:
let static_configurator = server.static;
```

<br><br>

## Properties

### StaticConfigurator.prototype.index_file

_string_ \- The index file path (absolute)

_**Note:** readonly, use the_ [_`index()`_](#staticconfiguratorprototypeindexfile) _method to assign a value._

***

<br>

### StaticConfigurator.prototype.resources

_Array<{ route, path }>_ \- An array containing all the static resources

- `route` _string_ \- The server route
- `path` _string_ \- The absolute path to a file/directory in disk

_**Note:** readonly, use the_ [_`add()`_](#staticconfiguratorprototypeaddroute-resource_path) _method to add a new resource._

***

<br><br>

## Methods

### StaticConfigurator.prototype.index(file)

Sets the main HTML file

_**Note:** The given file will be served in the root route (<http://localhost/>)._

#### Parameters

- `file` _string_ \- The relative/absolute file path

#### Returns

[_StaticConfigurator_](#) \- This same configurator (for method chaining)

#### Throws

- _TypeError_ \- If the file is not a string
- _Error_ \- If the file does not represent a path to a file

#### Examples

```javascript
server.static
   .index('../src/my_index.html');
```

***

<br>

### StaticConfigurator.prototype.add(route, resource\_path)

Registers a static directory or file to be served on the given route

#### Parameters

- `route` _string_ \- The server route
- `resource_path` _string_ \- The relative/absolute file/directory path

#### Returns

[_StaticConfigurator_](#) \- This same configurator (for method chaining)

#### Throws

- _TypeError_ \- If the resource path is not a string

#### Examples

```javascript
server.static
   .add('/static/js', '../src/js')
   .add('/static/css', '../src/css')
   .add('/static/logo', '../src/images/logo.png');
```

***

<br>

### StaticConfigurator.prototype.done()

Retrieves the main configurator

#### Returns

[_Configurator_](configurator.md) \- The main configurator (for configurator chaining)

#### Examples

```javascript
// *Main 'Configurator' object:
server
   .port(...)
   .static
      // *Inner 'StaticConfigurator' object:
      .index(...)
      .add(...)
      .add(...)
      .done()   // Returns the chain back to the main configurator
   // *Main 'Configurator' object:
   .start();
```
