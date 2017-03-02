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


   it('stores the resources as \"{ method, route, middleware }\" objects', function(done){
      // *Adding resources:
      configurator.api
         .add('GET', '/zzz', ()=>{});

      // *Expecting the resources to have the 'method', 'route' and 'middleware' attributes:
      expect(configurator.api.resources[0])
         .to.have.ownProperty('method');
      expect(configurator.api.resources[0])
         .to.have.ownProperty('route');
      expect(configurator.api.resources[0])
         .to.have.ownProperty('middleware');

      // *Finishing this unit:
      done();
   });


   it('stores the resources in the same order they were defined', function(done){
      // *Adding resources:
      configurator.api
         .add('GET', 'a', ()=>{})
         .add('GET', 'b', ()=>{})
         .add('GET', 'c', ()=>{});

      // *Expecting that the resources were added in the correct order:
      expect(configurator.api.resources.reduce((str, r) => str+r.route, ''))
         .to.equal('abc');

      // *Finishing this unit:
      done();
   });


   it('only allows to register routes for supported HTTP methods', function(done){
      // *Defining the test function:
      expect(() => {
         // *Adding routes with unsupported HTTP methods (other than GET, POST, PUT or DELETE):
         configurator.api
            .add('ZZZ', '/zzz', ()=>{});
      })
      // *Expecting it to throw an error:
      .to.throw(Error, 'The \"ZZZ\" is not a supported HTTP method');

      // *Adding routes with supported HTTP methods (GET, POST, PUT or DELETE):
      configurator.api
         .add('GET', '/zzz', ()=>{})
         .add('POST', '/zzz', ()=>{})
         .add('PUT', '/zzz', ()=>{})
         .add('DELETE', '/zzz', ()=>{});

      // *Expecting that every route method added is valid:
      expect(configurator.api.resources.every(({ method }) => isMethodSupported(method))).to.true;

      // *Finishing this unit:
      done();
   });


   it('assigns the methods correctly using the \"method name\" functions', function(done){
      // *Adding resources using the shorthand functions:
      configurator.api
         .get('/zzz', ()=>{})
         .post('/zzz', ()=>{})
         .put('/zzz', ()=>{})
         .delete('/zzz', ()=>{});

      // *Expecting that the methods were assigned correctly:
      expect(configurator.api.resources[0].method).to.equal('GET');
      expect(configurator.api.resources[1].method).to.equal('POST');
      expect(configurator.api.resources[2].method).to.equal('PUT');
      expect(configurator.api.resources[3].method).to.equal('DELETE');

      // *Finishing this unit:
      done();
   });

});
