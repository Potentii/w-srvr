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


   it('resolves into a \"{ server, address }\" object', function(done){
      // *Adding resources:
      configurator
         .start()
         .then(output => {
            // *Expecting the resolved object to have the 'server' and 'address' attributes:
            expect(output)
               .to.have.ownProperty('server');
            expect(output)
               .to.have.ownProperty('address');

            // *Finishing this unit:
            done();
         })
         .catch(err => {
            // *Finishing this unit with an error:
            done(err);
         });
   });


   describe('Static', function(){

      it('configures resources correctly', function(done){
         // *Adding resources:
         configurator.static
            .add('/static', './mock/mock-src')
            .index('./mock/mock-index.html')
            .done()

            // *Starting the server:
            .start()
            .then(({ address }) => {
               // *Returning a promise chain that tests in parallel:
               return Promise.all([

                  // *Testing if the static content is being served:
                  requestAsPromise(Configurator.METHODS.GET, address.href + 'static/mock-file.txt')
                     .then(res => {
                        expect(res.body.toString()).to.equal(fs.readFileSync(path.join(__dirname, './mock/mock-src/mock-file.txt'), 'utf8'));
                     }),

                  // *Testing if the index page is being served:
                  requestAsPromise(Configurator.METHODS.GET, address.href)
                     .then(res => {
                        expect(res.body.toString()).to.equal(fs.readFileSync(path.join(__dirname, './mock/mock-index.html'), 'utf8'));
                     })

                  ])
                  .then(() => {
                     // *Finishing this unit:
                     done();
                  });
            })
            .catch(err => {
               // *Finishing this unit with an error:
               done(err);
            });
      });

   });


   describe('API', function(){

      it('configures resources correctly', function(done){
         // *Adding resources:
         configurator.api
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
                  // *Finishing this unit:
                  done();
               });

            })
            .catch(err => {
               // *Finishing this unit with an error:
               done(err);
            });
      });


      it('applies advanced headers correctly', function(done){
         // *Adding resources:
         configurator.api
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

                  ])
                  .then(() => {
                     // *Finishing this unit:
                     done();
                  });

            })
            .catch(err => {
               // *Finishing this unit with an error:
               done(err);
            });
      });


      it('applies CORS preflight headers correctly', function(done){
         // *Adding resources:
         configurator.api
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

                  ])
                  .then(() => {
                     // *Finishing this unit:
                     done();
                  });

            })
            .catch(err => {
               // *Finishing this unit with an error:
               done(err);
            });
      });


      it('applies the parsers settings correctly', function(done){
         // *Defining the body to be parsed:
         const BODY_JSON = JSON.stringify({ping: 'pong'});

         // *Adding resources:
         configurator.api
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

                  ])
                  .then(() => {
                     // *Finishing this unit:
                     done();
                  });

            })
            .catch(err => {
               // *Finishing this unit with an error:
               done(err);
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
      request({ method, url, headers, body },
      (error, response, body) => {
         // *If some error occurred, rejecting the promise:
         if(error) return reject(err);
         // *Resolving the promise with the response from the server:
         resolve({ response, body });
      });
   });
}
