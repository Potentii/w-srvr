// *Requiring the needed modules:
const stack = require('callsite');
const path = require('path');



/**
 * Represents a set of static resources
 * @author Guilherme Reginaldo Ruella
 */
module.exports = class StaticConfigurator{

   /**
    * Creates a new static resources configurator
    */
   constructor(main_configurator){
      // *Setting the main configurator reference:
      this._main_configurator = main_configurator;

      // *Initializing the options:
      this._spa_file = null;
      this._resources = [];
   }



   /**
    * Sets the main HTML file
    * @param  {string} file  The relative/absolute file path
    * @return {Configurator} This configurator (for method chaining)
    */
   spa(file){
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
      this._spa_file = file;
      // *Returning this configurator:
      return this;
   }



   /**
    * Registers a static directory or file to be served on a given route
    * @param  {string} route         The server route
    * @param  {string} resource_path The relative/absolute file/directory path
    * @return {Configurator}         This configurator (for method chaining)
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
    * @return {Configurator}  The main configurator (for method chaining)
    */
   done(){
      return this._main_configurator;
   }



   /**
    * Retrieves SPA file path
    * @return {string} The absolute file path
    */
   get spa_file(){
      return this._spa_file;
   }



   /**
    * Retrieves the static resources
    * @return {Array} An array containing '{ route, path }' objects
    */
   get resources(){
      return this._resources.concat([]);
   }

};