// *Requiring the needed modules:
const Configurator = require('..');
const { isMethodSupported } = require('../libs/methods.js');
const path = require('path');
const { expect } = require('chai');



// *Describing the test suit:
describe('API', function(){

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
      // *Unreferencing the configurator:
      configurator = null;
      // *Finishing this unit:
      done();
   });


   it('stores the resources as a \"{ method, route, middleware }\" object', function(done){
      // *Adding resources:
      configurator.api
         .add('GET', '/abc', ()=>{});

      // *Expecting the resources to have the 'method', 'route' and 'middleware' attributes:
      expect(configurator.api.resources.every(r => {
         return r.hasOwnProperty('method') && r.hasOwnProperty('route') && r.hasOwnProperty('middleware');
      })).to.true;

      // *Finishing this unit:
      done();
   });


   it('stores the resources in the same order they were defined', function(done){
      // *Declaring the control variable:
      let abc = '';

      // *Adding resources:
      configurator.api
         .add('GET', 'a', ()=>{})
         .add('GET', 'b', ()=>{})
         .add('GET', 'c', ()=>{});

      // *Assigning the control variable with the routes strings:
      configurator.api.resources.forEach(r => abc += r.route);

      // *Expecting the control variable to reveal that the resources were added in the correct order:
      expect(abc).to.equal('abc');

      // *Finishing this unit:
      done();
   });


   it('only allows to register routes for supported HTTP methods', function(done){
      // *Defining the test function:
      expect(() => {
         // *Adding routes with unsupported HTTP methods (other than GET, POST, PUT or DELETE):
         configurator.api
            .add('ABC', '/abc', ()=>{});
      })
      // *Expecting it to throw an error:
      .to.throw(Error, 'The \"ABC\" is not a supported HTTP method');

      // *Adding routes with supported HTTP methods (GET, POST, PUT or DELETE):
      configurator.api
         .add('GET', '/abc', ()=>{})
         .add('POST', '/abc', ()=>{})
         .add('PUT', '/abc', ()=>{})
         .add('DELETE', '/abc', ()=>{});

      // *Expecting that every route method added is valid:
      expect(configurator.api.resources.every(({ method }) => isMethodSupported(method))).to.true;

      // *Finishing this unit:
      done();
   });


   it('assigns the methods correctly using the \"method name\" functions', function(done){
      // *Adding resources using the shorthand functions:
      configurator.api
         .get('/abc', ()=>{})
         .post('/abc', ()=>{})
         .put('/abc', ()=>{})
         .delete('/abc', ()=>{});

      // *Expecting that the methods were assigned correctly:
      expect(configurator.api.resources[0].method).to.equal('GET');
      expect(configurator.api.resources[1].method).to.equal('POST');
      expect(configurator.api.resources[2].method).to.equal('PUT');
      expect(configurator.api.resources[3].method).to.equal('DELETE');

      // *Finishing this unit:
      done();
   });

});
