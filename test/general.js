// *Requiring the needed modules:
const Configurator = require('..');
const { expect } = require('chai');



// *Describing the test suit:
describe('General', function(){

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


   it('uses the default HTTP port if none is set', function(done){
      // *Expecting the default server port to be '80':
      expect(configurator.server_port).to.equal(80);

      // *Finishing this unit:
      done();
   });


   it('provides access to the inner \"api\" and \"static\" configurators', function(done){
      // *Getting the types definition:
      const StaticConfigurator = require('../libs/static-configurator.js');
      const APIConfigurator = require('../libs/api-configurator.js');

      // *Expecting the inner configurators to be the correct type:
      expect(configurator.static).to.instanceof(StaticConfigurator);
      expect(configurator.api).to.instanceof(APIConfigurator);

      // *Finishing this unit:
      done();
   });

});
