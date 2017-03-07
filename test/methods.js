// *Requiring the needed modules:
const { METHODS, isMethodSupported } = require('../libs/methods.js');
const { expect } = require('chai');



// *Describing the test suit:
describe('Methods', function(){

   it('supports GET, POST, PUT, DELETE, HEAD, PATCH and OPTIONS HTTP methods', function(done){
      // *Expecting the enum to have the HTTP methods:
      expect(METHODS.hasOwnProperty('GET')).to.true;
      expect(METHODS.hasOwnProperty('POST')).to.true;
      expect(METHODS.hasOwnProperty('PUT')).to.true;
      expect(METHODS.hasOwnProperty('DELETE')).to.true;
      expect(METHODS.hasOwnProperty('HEAD')).to.true;
      expect(METHODS.hasOwnProperty('PATCH')).to.true;
      expect(METHODS.hasOwnProperty('OPTIONS')).to.true;

      // *Finishing this unit:
      done();
   });


   it('tells correctly whether a method is supported or not', function(done){
      // *Expecting that passing an undefined method name fails:
      expect(isMethodSupported()).to.false;
      // *Expecting that passing an object (not a string) method name fails:
      expect(isMethodSupported({})).to.false;
      // *Expecting that passing an empty string method name fails:
      expect(isMethodSupported('')).to.false;
      // *Expecting that passing an unsupported method name fails:
      expect(isMethodSupported('ABC')).to.false;
      // *Expecting that passing an unsupported (but valid HTTP verb) method name fails:
      expect(isMethodSupported('CONNECT')).to.false;

      // *Getting each of the valid methods:
      for(let method in METHODS){
         if(METHODS.hasOwnProperty(method)){
            // *Expecting that they are supported:
            expect(isMethodSupported(METHODS[method])).to.true;
         }
      }

      // *Finishing this unit:
      done();
   });


   it('does not allow to change the methods name', function(done){
      // *Getting each method:
      for(let method in METHODS){
         if(METHODS.hasOwnProperty(method)){
            // *Trying to change the methods names:
            METHODS[method] = 'ABC';
         }
      }

      // *Getting each method:
      for(let method in METHODS){
         if(METHODS.hasOwnProperty(method)){
            // *Expecting that the methods names have not chaged:
            expect(METHODS[method]).to.not.equal('ABC');
         }
      }

      // *Finishing this unit:
      done();
   });

});
