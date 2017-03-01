// *Requiring the needed modules:
const Configurator = require('..');
const path = require('path');
const { expect } = require('chai');



// *Describing the test suit:
describe('Static', function(){

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


   describe('Resources', function(){

      it('only allows to add resources paths as strings', function(done){
         // *Defining the test function that fails:
         expect(() => {
            // *Adding resource paths as objects (not strings):
            configurator.static
               .add('/abc', new Object());
         })
         // *Expecting it to throw an error:
         .to.throw(TypeError, 'The \"resource path\" must be a string');

         // *Defining the test function that succeeds:
         expect(() => {
            // *Adding resource paths as strings:
            configurator.static
               .add('/abc', './def');
         })
         // *Expecting it not to fail:
         .to.not.throw();

         // *Finishing this unit:
         done();
      });


      it('accepts absolute paths', function(done){
         // *Adding static resources (absolute paths):
         configurator.static
            .add('/abc', path.join(__dirname, './abc'))
            .add('/abc', path.join(__dirname, '../abc'));

         // *Expecting them to be correctly assigned:
         expect(configurator.static.resources[0].path).to.equal(path.join(__dirname, './abc'));
         expect(configurator.static.resources[1].path).to.equal(path.join(__dirname, '../abc'));

         // *Finishing this unit:
         done();
      });


      it('accepts paths relative to the caller', function(done){
         // *Adding static resources (relative paths):
         configurator.static
            .add('/abc', './abc')
            .add('/abc', '../abc');

         // *Expecting them to be correctly assigned:
         expect(configurator.static.resources[0].path).to.equal(path.join(__dirname, './abc'));
         expect(configurator.static.resources[1].path).to.equal(path.join(__dirname, '../abc'));

         // *Finishing this unit:
         done();
      });

   });


   describe('SPA', function(){

      it('only allows to set the path as string', function(done){
         // *Defining the test function that fails:
         expect(() => {
            // *Setting the spa path as an object (not a string):
            configurator.static
               .spa(new Object());
         })
         // *Expecting it to throw an error:
         .to.throw(TypeError, 'The \"file\" must be a string');

         // *Defining the test function that succeeds:
         expect(() => {
            // *Setting the spa path as string:
            configurator.static
               .spa('./abc.html');
         })
         // *Expecting it not to fail:
         .to.not.throw();

         // *Finishing this unit:
         done();
      });


      it('only allows to set paths that represents a file (The file may or may not exist)', function(done){
         // *Defining the test function that fails:
         expect(() => {
            configurator.static
               // *Setting the spa as a directory path (not a file):
               .spa('./abc');
         })
         // *Expecting it to throw an error:
         .to.throw(Error, 'The \"file\" must be path to a file');

         // *Defining the test function that succeeds:
         expect(() => {
            // *Setting the spa as a file path:
            configurator.static
               .spa('./abc.html');
         })
         // *Expecting it not to fail:
         .to.not.throw();

         // *Finishing this unit:
         done();
      });


      it('accepts absolute paths', function(done){
         // *Setting the SPA file path (absolute):
         configurator.static
            .spa(path.join(__dirname, '../abc.html'));

         // *Expecting it to be correctly assigned:
         expect(configurator.static.spa_file).to.equal(path.join(__dirname, '../abc.html'));

         // *Finishing this unit:
         done();
      });


      it('accepts paths relative to the caller', function(done){
         // *Setting the SPA file path (relative to the caller):
         configurator.static
            .spa('../abc.html');

         // *Expecting it to be correctly assigned:
         expect(configurator.static.spa_file).to.equal(path.join(__dirname, '../abc.html'));

         // *Finishing this unit:
         done();
      });

   });

});
