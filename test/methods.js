// *Requiring the needed modules:
const { METHODS, isMethodSupported } = require('../libs/methods.js');
const { expect } = require('chai');



// *Describing the test suit:
describe('Methods', function(){

   it('supports the basic HTTP methods for CRUD operations (GET, POST, PUT and DELETE)', function(done){
      // *Expecting the enum to have the CRUD HTTP methods:
      expect(METHODS.hasOwnProperty('GET')).to.true;
      expect(METHODS.hasOwnProperty('POST')).to.true;
      expect(METHODS.hasOwnProperty('PUT')).to.true;
      expect(METHODS.hasOwnProperty('DELETE')).to.true;

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
      expect(isMethodSupported('OPTIONS')).to.false;

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
      // *Trying to change the methods names:
      METHODS.GET = 'ABC';
      METHODS.POST = 'DEF';
      METHODS.PUT = 'GHI';
      METHODS.DELETE = 'JKL';

      // *Expecting them not to change:
      expect(METHODS.GET).to.equal('GET');
      expect(METHODS.POST).to.equal('POST');
      expect(METHODS.PUT).to.equal('PUT');
      expect(METHODS.DELETE).to.equal('DELETE');

      // *Finishing this unit:
      done();
   });

});
