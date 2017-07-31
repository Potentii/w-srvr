// *Requiring the needed modules:
const Configurator = require('..');
const request = require('request');
const fs = require('fs');
const path = require('path');
const { expect } = require('chai');



// *Describing the test suit:
describe('Boot', function(){

   // *Declaring the configurator variable:
   let configurator = null;


   // *Before each test:
   beforeEach(function(done){
      // *Creating a new configurator:
      configurator = new Configurator();
      // *Finishing this unit:
      done();
   });


   // *After each test:
   afterEach(function(done){
      if(configurator)
         configurator.stop()
            .then(() => {
               // *Unreferencing the configurator:
               configurator = null;
               // *Finishing this unit:
               done();
            })
            .catch(err => {
               // *Unreferencing the configurator:
               configurator = null;
               // *Finishing this unit with an error:
               done(err);
            });
   });


   it('resolves into a \"{ server, address }\" object', function(){
      // *Adding resources:
      return configurator.port(3000)
         .start()
         .then(output => {
            // *Expecting the resolved object to have the 'server' and 'address' attributes:
            expect(output)
               .to.have.ownProperty('server');
            expect(output)
               .to.have.ownProperty('address');
         });
   });

   it('sets the Express \'locals\' object', function(){
      // *Defining the locals object:
      const locals = {
         a: 1,
         b: 2,
         c: 3
      };

      // *Setting the locals object and serving it:
      return configurator.port(3000)
         .locals(locals)
         .api
            .get('/', (req, res, next) => res.status(200).json(req.app.locals).end())
            .done()
         .start()
         .then(({ address }) => {
            // *Expecting the Express locals to be set:
            return requestAsPromise(Configurator.METHODS.GET, address.href)
               .then(res => expect(JSON.parse(res.response.body)).to.deep.include(locals));
         });
   });


   describe('HTTPS', function(){

      it('starts an HTTPS server using \"key\" and \"cert\"', function(){
         // *Starting the server:
         return configurator.port(3000)
            .https({ key: './test/mock/https/key.key', cert: './test/mock/https/cert.crt' }, true)
            .api
               .get('/', (req, res, next) => res.status(200).end())
               .done()
            .start()
            .then(({ address }) => {
               // *Expecting the protocol to be HTTPS:
               expect(address.protocol).to.equal('https:');

               // *Expecting the resources to be responding correctly:
               return requestAsPromise(Configurator.METHODS.GET, address.href)
                  .then(res => expect(res.response.statusCode).to.equal(200));
            });
      });


      it('starts an HTTPS server using \"pfx\" and \"passphrase\"', function(){
         // *Starting the server:
         return configurator.port(3000)
            .https({ pfx: './test/mock/https/pfx.pfx', passphrase: './test/mock/https/pass.txt' }, true)
            .api
               .get('/', (req, res, next) => res.status(200).end())
               .done()
            .start()
            .then(({ address }) => {
               // *Expecting the protocol to be HTTPS:
               expect(address.protocol).to.equal('https:');

               // *Expecting the resources to be responding correctly:
               return requestAsPromise(Configurator.METHODS.GET, address.href)
                  .then(res => expect(res.response.statusCode).to.equal(200));
            });
      });

   });


   describe('Hooks', function(){

      it('calls the hooks functions', function(){
         // *Starting a control variable:
         let control = 0;

         // *Assigning some hook functions and starting the server:
         return configurator.port(3000)
            .on(Configurator.HOOKS.BEFORE_SETUP, () => control++)

            .on(Configurator.HOOKS.BEFORE_API_SETUP, () => control++)
            .on(Configurator.HOOKS.AFTER_API_SETUP, () => control++)

            .on(Configurator.HOOKS.BEFORE_STATIC_SETUP, () => control++)
            .on(Configurator.HOOKS.AFTER_STATIC_SETUP, () => control++)

            .on(Configurator.HOOKS.AFTER_SETUP, () => control++)
            .start()
            // *Expecting that the control variable were assigned correctly (which means that the hooks have been called):
            .then(() => expect(control).to.equal(6))
      });

   });

   it('ends hanging response chains', function(){
      // *Adding a route that tries to chain with others:
      return configurator.port(3000)
         .api
            .get('/', (req, res, next) => {
               res.status(200);
               next();
            })
            .done()
         // *Starting the server:
         .start()
         .then(({ address }) => {
            // *Testing if the response is being sent back:
            return requestAsPromise(Configurator.METHODS.GET, address.href)
               .then(res => expect(res.response.statusCode).to.equal(200));
         });
   });


   describe('404', function(){

      it('defaults the initial status code to \"404 NOT FOUND\" for each route', function(){
         // *Adding a route that just responds back:
         return configurator.port(3000)
            .api
               .get('/', (req, res, next) => res.end())
               .done()
            // *Starting the server:
            .start()
            .then(({ address }) => {
               // *Testing if the response is being sent back with the default status code:
               return requestAsPromise(Configurator.METHODS.GET, address.href)
                  .then(res => expect(res.response.statusCode).to.equal(404));
            });
      });

      it('sends a \"404 NOT FOUND\" response only if none of the routes matches', function(){
         // *Adding a route that just responds back with a '200 OK' code:
         return configurator.port(3000)
            .api
               .get('/', (req, res, next) => res.status(200).end())
               .done()
            // *Starting the server:
            .start()
            .then(({ address }) => {
               return Promise.all([
                  // *Testing if the route is being matched:
                  requestAsPromise(Configurator.METHODS.GET, address.href)
                     .then(res => expect(res.response.statusCode).to.equal(200)),

                  // *Testing if the route is not being matched:
                  requestAsPromise(Configurator.METHODS.GET, address.href + 'zzz')
                     .then(res => expect(res.response.statusCode).to.equal(404))
               ]);
            });
      });

      it('executes the custom \"not found\" middleware', function(){
         // *Adding a custom 404 handler middleware:
         return configurator.port(3000)
            .notFound((req, res, next) => res.send('zzz').end())
            // *Starting the server:
            .start()
            .then(({ address }) => {
               // *Testing if the response is being sent back with the correct status and body:
               return requestAsPromise(Configurator.METHODS.GET, address.href)
                  .then(res => {
                     expect(res.response.statusCode).to.equal(404);
                     expect(res.body.toString()).to.equal('zzz');
                  });
            });
      });

      it('allows the custom \"not found\" middleware to change the response status', function(){
         // *Adding a custom 404 handler middleware that changes the response status:
         return configurator.port(3000)
            .notFound((req, res, next) => res.status(200).end())
            // *Starting the server:
            .start()
            .then(({ address }) => {
               // *Testing if the response is being sent back with the correct status:
               return requestAsPromise(Configurator.METHODS.GET, address.href)
                  .then(res => expect(res.response.statusCode).to.equal(200));
            });
      });

      it('ends responses chain after the custom \"not found\" middleware', function(){
         // *Adding a custom 404 handler middleware that tries to chain with other middlewares:
         return configurator.port(3000)
            .notFound((req, res, next) => {
               res.status(200);
               next();
            })
            // *Starting the server:
            .start()
            .then(({ address }) => {
               // *Testing if the response is being sent back with the correct status:
               return requestAsPromise(Configurator.METHODS.GET, address.href)
                  .then(res => expect(res.response.statusCode).to.equal(200));
            });
      });

   });


   describe('Static', function(){

      it('configures resources correctly', function(){
         // *Adding resources:
         return configurator.port(3000)
            .static
               .add('/static', './mock/mock-src', { dotfiles: 'allow' })
               .done()
            // *Starting the server:
            .start()
            .then(({ address }) => {
               // *Returning a promise chain that tests in parallel:
               return Promise.all([
                  // *Testing if the static content is being served:
                  requestAsPromise(Configurator.METHODS.GET, address.href + 'static/mock-file.txt')
                     .then(res => {
                        expect(res.response.statusCode).to.equal(200);
                        expect(res.body.toString()).to.equal(fs.readFileSync(path.join(__dirname, './mock/mock-src/mock-file.txt'), 'utf8'));
                     }),

                  // *Testing if dotfiles are being supported:
                  requestAsPromise(Configurator.METHODS.GET, address.href + 'static/.txt')
                     .then(res => {
                        expect(res.response.statusCode).to.equal(200);
                        expect(res.body.toString()).to.equal(fs.readFileSync(path.join(__dirname, './mock/mock-src/.txt'), 'utf8'));
                     }),

                  // *Testing if a 404 response is being sent if the resource does not exist:
                  requestAsPromise(Configurator.METHODS.GET, address.href + 'static/mock-file-that-does-not-exists.txt')
                     .then(res => {
                        expect(res.response.statusCode).to.equal(404);
                        expect(res.body.toString()).to.be.empty;
                     })
               ]);
            });
      });


      describe('Index', function(){

         it('sends the index page only in root by default', function(){
            // *Adding resources:
            return configurator.port(3000)
               .static
                  .index('./mock/mock-index.html')
                  .done()
               // *Starting the server:
               .start()
               .then(({ address }) => {
                  // *Returning a promise chain that tests in parallel:
                  return Promise.all([

                     // *Testing if the index page is being served on root route:
                     requestAsPromise(Configurator.METHODS.GET, address.href)
                        .then(res => {
                           expect(res.response.statusCode).to.equal(200);
                           expect(res.body.toString()).to.equal(fs.readFileSync(path.join(__dirname, './mock/mock-index.html'), 'utf8'));
                        }),

                     // *Testing if the index page is not being served on other routes:
                     requestAsPromise(Configurator.METHODS.GET, address.href + 'zzz')
                        .then(res => {
                           expect(res.body.toString()).to.empty;
                           expect(res.response.statusCode).to.equal(404);
                        })

                  ]);
               });
         });

         it('sends the index page on all available routes if \"root_only\" is set to \"false\"', function(){
            // *Adding resources:
            return configurator.port(3000)
               .static
                  .index('./mock/mock-index.html', {root_only:false})
                  .done()
               // *Starting the server:
               .start()
               .then(({ address }) => {
                  // *Returning a promise chain that tests in parallel:
                  return Promise.all([

                     // *Testing if the index page is being served on root route:
                     requestAsPromise(Configurator.METHODS.GET, address.href)
                        .then(res => {
                           expect(res.response.statusCode).to.equal(200);
                           expect(res.body.toString()).to.equal(fs.readFileSync(path.join(__dirname, './mock/mock-index.html'), 'utf8'));
                        }),

                     // *Testing if the index page is being served on other routes as well:
                     requestAsPromise(Configurator.METHODS.GET, address.href + 'zzz')
                        .then(res => {
                           expect(res.response.statusCode).to.equal(200);
                           expect(res.body.toString()).to.equal(fs.readFileSync(path.join(__dirname, './mock/mock-index.html'), 'utf8'));
                        })

                  ]);
               });
         });

      });

   });


   describe('API', function(){

      it('configures resources correctly', function(){
         // *Adding resources:
         return configurator.port(3000)
            .api
            .get('/zzz', (req, res, next) => {
               res.status(200).send('a').end();
            })
            .post('/zzz', (req, res, next) => {
               res.status(201).send('b').end();
            })
            .put('/zzz', (req, res, next) => {
               res.status(200).send('c').end();
            })
            .delete('/zzz', (req, res, next) => {
               res.status(200).send('d').end();
            })
            .done()

            // *Starting the server:
            .start()
            .then(({ address }) => {
               // *Returning a promise chain that tests in parallel:
               return Promise.all([
                  requestAsPromise(Configurator.METHODS.GET,    address.href + 'zzz'),
                  requestAsPromise(Configurator.METHODS.POST,   address.href + 'zzz'),
                  requestAsPromise(Configurator.METHODS.PUT,    address.href + 'zzz'),
                  requestAsPromise(Configurator.METHODS.DELETE, address.href + 'zzz'),
               ])
               .then(responses => {
                  // *Concatenating the responses body:
                  let responses_sum = responses.reduce((str, res) => str+res.body.toString(), '');
                  // *Expecting it to be correct:
                  expect(responses_sum).to.equal('abcd');
               });
            });
      });


      it('applies advanced headers correctly', function(){
         // *Adding resources:
         return configurator.port(3000)
            .api
            .get('/*', (req, res, next) => next())
               .advanced
               .allowedOrigins('zzz.com')
               .done()
            .get('/yyy', (req, res, next) => res.end())
               .advanced
               .allowedOrigins('yyy.com')
               .done()
            .get('/zzz', (req, res, next) => res.end())
            .post('/zzz', (req, res, next) => res.end())
               .advanced
               .responseType('application/json')
               .done()
            .put('/zzz', (req, res, next) => res.end())
            .done()

            // *Starting the server:
            .start()
            .then(({ address }) => {
               // *Returning a promise chain that tests in parallel:
               return Promise.all([

                  requestAsPromise(Configurator.METHODS.GET, address.href + 'yyy')
                     .then(res => {
                        expect(res.response.headers['access-control-allow-origin']).to.equal('yyy.com');
                        expect(res.response.headers['content-type']).to.equal(undefined);
                     }),

                  requestAsPromise(Configurator.METHODS.GET, address.href + 'zzz')
                     .then(res => {
                        expect(res.response.headers['access-control-allow-origin']).to.equal('zzz.com');
                        expect(res.response.headers['content-type']).to.equal(undefined);
                     }),

                  requestAsPromise(Configurator.METHODS.POST, address.href + 'zzz')
                     .then(res => {
                        expect(res.response.headers['access-control-allow-origin']).to.equal(undefined);
                        expect(res.response.headers['content-type']).to.equal('application/json');
                     }),

                  requestAsPromise(Configurator.METHODS.PUT, address.href + 'zzz')
                     .then(res => {
                        expect(res.response.headers['access-control-allow-origin']).to.equal(undefined);
                        expect(res.response.headers['content-type']).to.equal(undefined);
                     })

                  ]);

            });
      });


      it('applies CORS preflight headers correctly', function(){
         // *Adding resources:
         return configurator.port(3000)
            .api
            .post('/zzz', (req, res, next) => res.end())
               .advanced
               .allowedOrigins('zzz.com')
               .allowedHeaders('My-Header-1')
               .allowedMethods('POST')
               .exposedHeaders('My-Header-2')
               .preflightMaxAge('200')
               .done()
            .done()

            // *Starting the server:
            .start()
            .then(({ address }) => {
               // *Returning a promise chain that tests in parallel:
               return Promise.all([

                  // *Testing the preflight request:
                  requestAsPromise('OPTIONS', address.href + 'zzz')
                     .then(res => {
                        expect(res.response.headers['access-control-allow-origin']).to.equal('zzz.com');
                        expect(res.response.headers['access-control-allow-headers']).to.equal('My-Header-1');
                        expect(res.response.headers['access-control-allow-methods']).to.equal('POST');
                        expect(res.response.headers['access-control-expose-headers']).to.equal(undefined);
                        expect(res.response.headers['access-control-max-age']).to.equal('200');
                     }),

                  // *Testing the actual request (It should not receive all the CORS headers):
                  requestAsPromise(Configurator.METHODS.POST, address.href + 'zzz')
                     .then(res => {
                        expect(res.response.headers['access-control-allow-origin']).to.equal('zzz.com');
                        expect(res.response.headers['access-control-allow-headers']).to.equal(undefined);
                        expect(res.response.headers['access-control-allow-methods']).to.equal(undefined);
                        expect(res.response.headers['access-control-expose-headers']).to.equal('My-Header-2');
                        expect(res.response.headers['access-control-max-age']).to.equal(undefined);
                     })

                  ]);

            });
      });


      it('applies the parsers settings correctly', function(){
         // *Defining the body to be parsed:
         const BODY_JSON = JSON.stringify({ping: 'pong'});

         // *Adding resources:
         return configurator.port(3000)
            .api
            .post('/echo', (req, res, next) => res.send(req.body).end())
               .advanced
               .parseJSON()
               .done()
            .post('/not-echo', (req, res, next) => res.send(req.body).end())
            .done()

            // *Starting the server:
            .start()
            .then(({ address }) => {
               // *Returning a promise chain that tests in parallel:
               return Promise.all([

                  // *Testing if the body could be parsed and sent as response:
                  requestAsPromise(Configurator.METHODS.POST, address.href + 'echo', {'Content-Type':'application/json; charset=utf-8'}, BODY_JSON)
                     .then(res => {
                        expect(res.body.toString()).to.equal(BODY_JSON);
                     }),

                  // *Testing if the body could not be parsed and sent as response:
                  requestAsPromise(Configurator.METHODS.POST, address.href + 'not-echo', {'Content-Type':'application/json; charset=utf-8'}, BODY_JSON)
                     .then(res => {
                        expect(res.body.toString()).to.equal('');
                     })

                  ]);

            });
      });

   });

});



/**
 * Wraps a simple HTTP request in a promise
 * @param  {string} method  The HTTP method
 * @param  {string} url     The server URL
 * @param  {object} headers The request headers
 * @param  {string} body    The request body
 * @return {Promise}        A promise that resolves into a { response, body } object, or rejects if some error occurs
 */
function requestAsPromise(method, url, headers, body){
   // *Returning the request promise:
   return new Promise((resolve, reject) => {
      // *Making the request:
      request({
            method,
            url,
            headers,
            body,
            rejectUnauthorized: false,
            requestCert: true,
            agent: false
         },
         (err, response, body) => {
            // *If some error occurred, rejecting the promise:
            if(err) return reject(err);
            // *Resolving the promise with the response from the server:
            resolve({ response, body });
         });
   });
}
