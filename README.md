# W-SRVR
A simple web server configurator for [Expressjs](http://expressjs.com/)

It makes the process of setting up a web server less verbose, by wrapping an Expressjs server inside an easy to use configurator.

<br>

## Table of contents
- [Installing](#installing)
- [Configurator class](#configurator-class)
- [Configurator instance](#configurator-instance)
- [Examples](#examples)
 - [Static content for a website](#static-content-for-a-website)
 - [Web service](#web-service)
- [Contributing](#contributing)
- [License](#license)

<br>

## Installing
This project is available on NPM, so you can just:
```sh
$ npm install w-srvr --save
```

<br>

## Configurator class

When you request this module, the `Configurator` class will be returned:
```js
const Configurator = require('w-srvr');
```

So now you can create new configurator objects:
```js
const srvr = new Configurator();
```
The `srvr` object now can be used to **configure**, **start** and **stop** a web server.

<br>

## Configurator instance

### #port(port_number)
**`port_number` <_String_|_Number_>** The port which the server will run on<br>

Sets the server port. _The default value is `80`_.<br>
Returns the same Configurator object for method chaining.<br>

### #spa(file)
**`file` <_String_>** The relative file path<br>

Sets the main HTML file.<br>
The given file will be served on every route that does not have any static file or API route mount on.<br>
Returns the same Configurator object for method chaining.<br>

### #serve(route, resource_path)
**`route` <_String_>** The server route<br>
**`resource_path` <_String_>** The relative file/directory path<br>

Serves a static directory or file, on the given server route.<br>
Returns the same Configurator object for method chaining.<br>

### #api(method, route, middleware)
**`method` <_String_>** An HTTP method (it can be either GET, POST, PUT or DELETE)<br>
**`route` <_String_>** The server route<br>
**`middleware` <_Function_|_Function[]_>** A valid Expressjs middleware function<br>

Registers a middleware for a specific route and HTTP method.<br>
Returns the same Configurator object for method chaining.<br>

```js
// Just like you would do with Express...
// This will configure a handler for GET requests on /my-route
srvr.api('GET', '/my-route', function(req, res, next){
   // Some cool stuff here...
});
```

### #apiGET(route, middleware)
**`route` <_String_>** The server route<br>
**`middleware` <_Function_|_Function[]_>** A valid Expressjs middleware function<br>

Registers a middleware for a specific `GET` route.<br>
Returns the same Configurator object for method chaining.<br>

```js
// *It is a shorthand for:
srvr.api('GET', route, middleware);
```

### #apiPOST(route, middleware)
**`route` <_String_>** The server route<br>
**`middleware` <_Function_|_Function[]_>** A valid Expressjs middleware function<br>

Registers a middleware for a specific `POST` route.<br>
Returns the same Configurator object for method chaining.<br>

```js
// *It is a shorthand for:
srvr.api('POST', route, middleware);
```

### #apiPUT(route, middleware)
**`route` <_String_>** The server route<br>
**`middleware` <_Function_|_Function[]_>** A valid Expressjs middleware function<br>

Registers a middleware for a specific `PUT` route.<br>
Returns the same Configurator object for method chaining.<br>

```js
// *It is a shorthand for:
srvr.api('PUT', route, middleware);
```

### #apiDELETE(route, middleware)
**`route` <_String_>** The server route<br>
**`middleware` <_Function_|_Function[]_>** A valid Expressjs middleware function<br>

Registers a middleware for a specific `DELETE` route.<br>
Returns the same Configurator object for method chaining.<br>

```js
// *It is a shorthand for:
srvr.api('DELETE', route, middleware);
```

### #start()

Starts the server instance.<br>
It will apply your settings and start an Expressjs server, so it should be called after the configurations have been done.<br>

It returns a promise that could resolve into an object containing:<br>
- **`address` <_[URL](https://nodejs.org/api/url.html)_>** The server address object

If the server could not be started for some reason, the promise will reject with an error.<br>

### #stop()

Stops the current server instance.<br>
It will end all connections remaining in the current server, and release the listened port.<br>

It returns a promise that resolves if everything goes ok.<br>
If the server could not be stopped for some reason, the promise will reject with an error.<br>

<br>

## Examples

### Static content for a website

Lets say your website content is located under the `src` folder:
```txt
├── main.js
└── src
    ├── css
    ├── js
    ├── imgs
    └── index.html
```

<br>
How we can serve all the `/src` folder content under the `/static` route, and make the `index.html` behave as the SPA page?

Notice that the `Configurator` is designed to be used with method chaining, so you can implement your server like this:

> main.js

```js
// *Setting up the server port:
srvr.port(3000)

   // *Setting up the static content:
   .serve('/static/css', './src/css')
   .serve('/static/js',  './src/js')
   .serve('/static/img', './src/img')

   // *Setting up the SPA page file:
   .spa('./src/index.html')

   // *Starting the server:
   .start()

   // *From this point down, the Configurator chain turns into a Promise chain:
   // *Logging the server address:
   .then(info => console.log('Server started at ' + info.address.href))
   // *Logging errors:
   .catch(err => console.error(err));
```


### Web service

Is easy to build a simple web service with some routes:

```js
// *Setting up the server port:
srvr.port(3000)

   // *Setting up the server routes:
   .apiGET('/ping', function(req, res, next){
      res.status(200)
         .send('pong')
         .end();
   })

   // *Starting the server:
   .start()
   // *Logging the server address:
   .then(info => console.log('Server started at ' + info.address.href))
   // *Logging errors:
   .catch(err => console.error(err));
```

<br>
As your server starts to grow and gets more complex, you may want to organize your routes in separate files, so lets say you have the following project structure:
```txt
├── main.js
└── routes
    └── users.js
```

<br>
Considering that `users.js` exposes some Expressjs middleware functions, we could build a CRUD web service this way:

> main.js

```js
// *Getting the users middleware routes module:
const users = require('./routes/users.js');

// *Setting up the server port:
srvr.port(3000)

   // *Setting up the web service routes:
   .apiGET('/api/v1/users',        users.getAll)
   .apiGET('/api/v1/users/:id',    users.getOne)
   .apiPOST('/api/v1/users',       users.insert)
   .apiPUT('/api/v1/users/:id',    users.update)
   .apiDELETE('/api/v1/users/:id', users.remove)

   // *Starting the server:
   .start()
   // *Logging the server address:
   .then(info => console.log('Server started at ' + info.address.href))
   // *Logging errors:
   .catch(err => console.error(err));
```

<br>

## Contributing
If you want a feature to be added, please open an [issue](https://github.com/Potentii/w-srvr/issues).

<br>

## License
[MIT](https://github.com/Potentii/w-srvr/blob/master/LICENSE.txt)
