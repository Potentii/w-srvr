// *Requiring the needed modules:
const stack = require('callsite');
const path = require('path');



/**
 * Represents a set of static resources
 */
module.exports = class StaticConfigurator{

   /**
    * Creates a new static resources configurator
    * @param {Configurator} main_configurator The main configurator reference
    */
   constructor(main_configurator){
      /**
       * The main configurator
       * @private
       * @type {Configurator}
       */
      this._main_configurator = main_configurator;

      /**
       * The index page file path
       * @private
       * @type {string}
       */
      this._index_file = null;

      /**
       * Static resources
       * @private
       * @type {Array}
       */
      this._resources = [];
   }



   /**
    * Sets the main HTML file
    * @param  {string} file  The relative/absolute file path
    * @return {Configurator} This configurator (for method chaining)
    * @throws {TypeError}    If the file is not a string
    * @throws {Error}        If the file does not represent a path to a file
    */
   index(file){
      // *Checking if the file is a string, throwing an error if it isn't:
      if(!(typeof file === 'string'))
         throw new TypeError('The \"file\" must be a string');

      // *Checking if the file represents a file path, throwing an error if it doesn't:
      if(path.extname(file).length < 2)
         throw new Error('The \"file\" must be path to a file');

      // *Checking if the file path is absolute:
      if(!path.isAbsolute(file)){
         // *If it isn't:
         // *Resolving the caller method '__dirname':
         file = path.join(path.dirname(stack()[1].getFileName()), file);
      }

      // *Setting the file name:
      this._index_file = file;
      // *Returning this configurator:
      return this;
   }



   /**
    * Registers a static directory or file to be served on the given route
    * @param  {string} route         The server route
    * @param  {string} resource_path The relative/absolute file/directory path
    * @return {Configurator}         This configurator (for method chaining)
    * @throws {TypeError}            If the resource path is not a string
    */
   add(route, resource_path){
      // *Checking if the resource path is a string, throwing an error if it isn't:
      if(!(typeof resource_path === 'string'))
         throw new TypeError('The \"resource path\" must be a string');

      // *Checking if the resource path is absolute:
      if(!path.isAbsolute(resource_path)){
         // *If it isn't:
         // *Resolving the caller method '__dirname':
         resource_path = path.join(path.dirname(stack()[1].getFileName()), resource_path);
      }

      // *Adding this resource into the array:
      this._resources.push({ route, path: resource_path });
      // *Returning this configurator:
      return this;
   }



   /**
    * Retrieves the main configurator
    * @return {Configurator}  The main configurator (for configurator chaining)
    */
   done(){
      return this._main_configurator;
   }



   /**
    * Retrieves absolute index file path
    * @readonly
    * @type {string}
    */
   get index_file(){
      return this._index_file;
   }



   /**
    * Retrieves the static resources (array of '{ route, path }' objects)
    * @readonly
    * @type {Array}
    */
   get resources(){
      return this._resources.concat([]);
   }

};
