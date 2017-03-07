// *Requiring the needed modules:
const Configurator = require('..');
const AdvancedAPIConfigurator = require('../libs/advanced-api-configurator.js');
const APIResource = require('../libs/api-resource.js');
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


   it('stores the resources as \"APIResource\" objects', function(done){
      // *Adding resources:
      configurator.api
         .add('GET', '/zzz', ()=>{});

      // *Expecting the resources to be APIResource objects:
      expect(configurator.api.resources[0])
         .to.instanceOf(APIResource);

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


   it('only allows the \"advanced\" chain to start right after a route has been added', function(done){
      // *Expecting the advanced call to throw an error:
      expect(() => configurator.api.advanced)
         .to.throw(Error, 'The \"advanced\" call must be chained only right after a route has been added');

      // *Adding a route:
      configurator.api
         .get('/yyy', ()=>{});

      // *Expecting the advanced call to throw an error:
      expect(() => configurator.api.advanced)
         .to.throw(Error, 'The \"advanced\" call must be chained only right after a route has been added');

      // *Expecting the advanced call to return a configurator:
      expect(configurator.api.get('/zzz', ()=>{}).advanced)
         .to.instanceOf(AdvancedAPIConfigurator);

      // *Expecting the advanced call return a configurator that belongs only to the last added route:
      expect(configurator.api
         .get('/aaa', ()=>{}).advanced.done()
         .get('/bbb', ()=>{}).advanced)
            .to.equal(configurator.api.resources.find(r => r.route === '/bbb').advanced);

      // *Finishing this unit:
      done();
   });

});
