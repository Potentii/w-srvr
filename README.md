# W-SRVR

[![NPM Version][npm-image]][npm-url]

A simple web server configurator for [`Expressjs`](http://expressjs.com/)

It makes the process of setting up a web server less verbose, by wrapping an `Expressjs` server inside a [`fluent interface`](https://en.wikipedia.org/wiki/Fluent_interface) configurator, so method calls can be chained for better readability.

<br><br>

## Table of contents

- [Installation](#installation)
- [Configurators](#configurators)
- [Other examples](#other-examples)
 - [Website](#website)
 - [Web service](#web-service)
 - [HTTPS](#https)
 - [CORS](#cors)
 - [Body parsing](#body-parsing)
- [Testing](#testing)
- [Feedback](#feedback)
- [License](#license)

<br><br>

## Installation

This module is available on [npm][npm-url], so you could just:
```bash
$ npm install w-srvr
```

<br><br>

## Configurators

The main [`Configurator`](docs/configurator.md) object gives you access to some settings as well as the inner configurators: [`StaticConfigurator`](docs/static-configurator.md) with `server.static`, and [`APIConfigurator`](docs/api-configurator.md) with `server.api`.

Here is an example:

```javascript
const Configurator = require('w-srvr');

const server = new Configurator();

server
   // *Setting the port:
   .port(3000)

   // *Configuring the API:
   .api
      .get('/api/users',     (req, res, next) => res.end())
      .get('/api/users/:id', (req, res, next) => res.end())
      .post('/api/users',    (req, res, next) => res.end())
      .done()

   // *Configuring the static resources:
   .static
      .add('/static/js',  '../src/js')
      .add('/static/css', '../src/css')
      .index('../src/index.html')
      .done()

   // *Starting the server:
   .start()
   .then(output => console.log('Server started at ' + output.address.href))
   .catch(err => console.error(err));
```

<br><br>

## Other examples

### Website

Lets say your website content is located under the `/src` folder:

```
├── main.js
└── src
    ├── css
    ├── js
    ├── imgs
    └── index.html
```

How we can serve all the `/src` folder content under the `/static` route, and setup the index page?

A simple way to do it would be:

> main.js

```javascript
server
   // *Setting up the server port:
   .port(3000)

   // *Setting up the static content, and the index page:
   .static
      .add('/static/css', './src/css')
      .add('/static/js',  './src/js')
      .add('/static/img', './src/img')
      .index('./src/index.html')
      .done()

   // *Starting the server:
   .start()
   // *Logging the server address:
   .then(output => console.log('Server started at ' + output.address.href))
   // *Logging errors:
   .catch(err => console.error(err));
```

_**See:**_

- [_StaticConfigurator_](docs/static-configurator.md)
- [*StaticConfigurator.prototype.add(route, resource\_path)*](docs/static-configurator.md#staticconfiguratorprototypeaddroute-resource_path-options)
- [_StaticConfigurator.prototype.index(file)_](docs/static-configurator.md#staticconfiguratorprototypeindexfile-options)

***

<br>

### Web service

Is easy to build a simple web service with some routes:

```javascript
server
   // *Setting up the server port:
   .port(3000)

   // *Setting up the server routes:
   .api
      .get('/ping', function(req, res, next){
         res.status(200)
            .send('pong')
            .end();
      })
      .done()

   // *Starting the server:
   .start()
   // *Logging the server address:
   .then(output => console.log('Server started at ' + output.address.href))
   // *Logging errors:
   .catch(err => console.error(err));
```

<br>

As your server starts to grow and gets more complex, you may want to organize your routes in separate files, so lets say you have the following project structure:

```
├── main.js
└── routes
    └── users.js
```

Considering that `users.js` exports some Expressjs middleware functions, we could build a CRUD web service this way:

> main.js

```javascript
// *Getting the users middleware routes module:
const users = require('./routes/users.js');

server
   // *Setting up the server port:
   .port(3000)

   // *Setting up the web service routes:
   .api
      .get('/api/v1/users',        users.getAll)
      .get('/api/v1/users/:id',    users.getOne)
      .post('/api/v1/users',       users.insert)
      .put('/api/v1/users/:id',    users.update)
      .delete('/api/v1/users/:id', users.remove)
      .done()

   // *Starting the server:
   .start()
   // *Logging the server address:
   .then(output => console.log('Server started at ' + output.address.href))
   // *Logging errors:
   .catch(err => console.error(err));
```

_**See:**_

- [_APIConfigurator_](docs/api-configurator.md)
- [_APIConfigurator.prototype.add(method, route, middleware)_](docs/api-configurator.md#apiconfiguratorprototypeaddmethods-route-middleware)
- [_APIConfigurator.prototype.get(route, middleware)_](docs/api-configurator.md#apiconfiguratorprototypegetroute-middleware)
- [_APIConfigurator.prototype.post(route, middleware)_](docs/api-configurator.md#apiconfiguratorprototypepostroute-middleware)
- [_APIConfigurator.prototype.put(route, middleware)_](docs/api-configurator.md#apiconfiguratorprototypeputroute-middleware)
- [_APIConfigurator.prototype.delete(route, middleware)_](docs/api-configurator.md#apiconfiguratorprototypedeleteroute-middleware)
- [_APIConfigurator.prototype.head(route, middleware)_](docs/api-configurator.md#apiconfiguratorprototypeheadroute-middleware)
- [_APIConfigurator.prototype.patch(route, middleware)_](docs/api-configurator.md#apiconfiguratorprototypepatchroute-middleware)
- [_APIConfigurator.prototype.options(route, middleware)_](docs/api-configurator.md#apiconfiguratorprototypeoptionsroute-middleware)
- [_APIConfigurator.prototype.all(route, middleware)_](docs/api-configurator.md#apiconfiguratorprototypeallroute-middleware)
- [_APIConfigurator.prototype.most(route, middleware)_](docs/api-configurator.md#apiconfiguratorprototypemostroute-middleware)

***

<br>

### HTTPS

It's simple to configure an HTTPS server using a **key** and **certificate**:

```javascript
server
   .https({
      key: './my-key.key',
      cert: './my-cert.crt'
   }, true)
   // ...
```

or using a **PFX** file:

```javascript
server
   .https({
      pfx: './my-pfx.pfx',
      passphrase: './my-pass.txt'
   }, true)
   // ...
```

_**See:**_

- [*Configurator.prototype.https(options, is\_file)*](docs/configurator.md#configuratorprototypehttpsoptions-is_file)

***

<br>

### CORS

The [`advanced configurator`](docs/advanced-api-configurator.md) helps you to setup CORS responses correctly:

```javascript
server.api
   .most('/api/v1/*')
      .advanced
      .allowedOrigins('*')
      .allowedMethods('GET', 'POST')
      .allowedHeaders('Content-Type')
      .done()
   .get(...)
   .post(...)
   // ...
```

Now, every origin can make `GET` and `POST` requests (with a JSON body for example, _see_ [_Body parsing_](#body-parsing)) to routes inside `/api/v1/` without being rejected by cross-origin policies.

You can get further information on CORS [_here (MDN)_](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS).

***

<br>

### Body parsing

The advanced configurator can also enable request body parsing:

```javascript
server.api
   .post(...)
      .advanced
      .parseJSON({limit: '400kb'})
      .parseURLEncoded()
      .done()
   .get(...)
```

_**See:**_

- [_body-parser_](https://github.com/expressjs/body-parser)
- [_AdvancedAPIConfigurator.prototype.parseJSON(options)_](docs/advanced-api-configurator.md#advancedapiconfiguratorprototypeparsejsonoptions)
- [_AdvancedAPIConfigurator.prototype.parseText(options)_](docs/advanced-api-configurator.md#advancedapiconfiguratorprototypeparsetextoptions)
- [_AdvancedAPIConfigurator.prototype.parseRaw(options)_](docs/advanced-api-configurator.md#advancedapiconfiguratorprototypeparserawoptions)
- [_AdvancedAPIConfigurator.prototype.parseURLEncoded(options)_](docs/advanced-api-configurator.md#advancedapiconfiguratorprototypeparseurlencodedoptions)

***

<br><br>

## Testing

If you would like to run the tests, you can do it with the `test` command:

```bash
$ npm test
```

Make sure you have installed the `dev-dependencies`, as the tests will need them:

```bash
$ npm install --only=dev
```

<br><br>

## Feedback

If you want a feature to be added or give some other feedback, feel free to open an [issue](https://github.com/Potentii/w-srvr/issues).

<br><br>

## License
[MIT](LICENSE.txt)

[npm-image]: https://img.shields.io/npm/v/w-srvr.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/w-srvr
