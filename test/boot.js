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
         .then(info => {
            // *Expecting the resolved object to have the 'server' and 'address' attributes:
            expect(info)
               .to.have.ownProperty('server');
            expect(info)
               .to.have.ownProperty('address');

            // *Finishing this unit:
            done();
         })
         .catch(err => {
            // *Finishing this unit with an error:
            done(err);
         });
   });


   it('configures static resources correctly', function(done){
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


   it('configures API resources correctly', function(done){
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
            })

         })
         .catch(err => {
            // *Finishing this unit with an error:
            done(err);
         });
   });

});



/**
 * Wraps a simple HTTP request in a promise
 * @param  {string} method The HTTP method
 * @param  {string} url    The server URL
 * @return {Promise}       A promise that resolves into a { response, body } object, or rejects if some error occurs
 */
function requestAsPromise(method, url){
   // *Returning the request promise:
   return new Promise((resolve, reject) => {
      // *Making the request:
      request({ method, uri: url },
      (error, response, body) => {
         // *If some error occurred, rejecting the promise:
         if(error) return reject(err);
         // *Resolving the promise with the response from the server:
         resolve({ response, body });
      });
   });
}
