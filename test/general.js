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


   it('uses the default protocol port if none is set', function(done){
      // *Expecting the default server port to be '80':
      expect(configurator.server_port).to.equal(80);
      // *Expecting the default server port to be '443' when using https:
      expect(configurator.https({ key: '', cert: ''}).server_port).to.equal(443);

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

   describe('HTTPS', function(){

      it('sets the secure options using \"key\" and \"cert\"', function(done){
         // *Setting the secure(HTTPS) options:
         const secure = { key: 'xxx', cert: 'yyy' };
         // *Enabling the HTTPS server:
         configurator.https(secure);

         // *Expecting that the configurations could be read properly:
         expect(configurator._secure.key).to.equal(secure.key);
         expect(configurator._secure.cert).to.equal(secure.cert);

         // *Finishing this unit:
         done();
      });


      it('sets the secure options using \"pfx\" and \"passphrase\"', function(done){
         // *Setting the secure(HTTPS) options:
         const secure = { pfx: 'xxx', passphrase: 'yyy' };
         // *Enabling the HTTPS server:
         configurator.https(secure);

         // *Expecting that the configurations could be read properly:
         expect(configurator._secure.pfx).to.equal(secure.pfx);
         expect(configurator._secure.passphrase).to.equal(secure.passphrase);

         // *Finishing this unit:
         done();
      });


      it('retrieves from disk the secure options using \"key\" and \"cert\"', function(done){
         // *Getting the fs module:
         const fs = require('fs');
         // *Setting the secure(HTTPS) options:
         const secure = { key: './test/mock/https/key.key', cert: './test/mock/https/cert.crt' };
         // *Enabling the HTTPS server:
         configurator.https(secure, true);

         // *Expecting that the configurations could be read properly:
         expect(configurator._secure.key).to.equal(fs.readFileSync(secure.key, 'utf8'));
         expect(configurator._secure.cert).to.equal(fs.readFileSync(secure.cert, 'utf8'));

         // *Finishing this unit:
         done();
      });


      it('retrieves from disk the secure options using \"pfx\" and \"passphrase\"', function(done){
         // *Getting the fs module:
         const fs = require('fs');
         // *Setting the secure(HTTPS) options:
         const secure = { pfx: './test/mock/https/pfx.pfx', passphrase: './test/mock/https/pass.txt' };
         // *Enabling the HTTPS server:
         configurator.https(secure, true);

         // *Expecting that the configurations could be read properly:
         expect(configurator._secure.pfx.toString('utf8')).to.equal(fs.readFileSync(secure.pfx, 'utf8'));
         expect(configurator._secure.passphrase).to.equal(fs.readFileSync(secure.passphrase, 'utf8'));

         // *Finishing this unit:
         done();
      });

   });

});
