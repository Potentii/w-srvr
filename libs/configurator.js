// *Requiring the needed modules:
const boot_server = require('./boot-server.js');
const methods_enum = require('./methods.js');
const stack = require('callsite');
const path = require('path');




/**
 * Represents a configurable server initializer
 * @author Guilherme Reginaldo Ruella
 */
module.exports = class Configurator{

   /**
    * Creates a new configurator
    */
   constructor(){
      // *Initializing the server options:
      this._server_port = 80;
      this._spa_file = null;
      this._static_resources = [];
      this._api_resources = [];

      // *Declaring the server promises:
      this._server_start_promise = null;
      this._server_stop_promise = null;
   }



   /**
    * Retrieves the HTTP methods enum
    */
   static get METHODS(){
      // *Returning the enum:
      return methods_enum;
   }



   /**
    * Sets the server port
    * @param  {number|string} port_number The port which the server will run on
    * @return {Configurator}              This configurator (for method chaining)
    */
   port(port_number){
      // *Setting the server port:
      this._server_port = port_number;
      // *Returning this configurator:
      return this;
   }



   /**
    * Sets the main HTML file
    * @param  {string} file  The relative file path
    * @return {Configurator} This configurator (for method chaining)
    */
   spa(file){
      // *Resolving the caller method '__dirname':
      let caller_dir = path.dirname(stack()[1].getFileName());
      // *Setting the file name:
      this._spa_file = path.join(caller_dir, file);
      // *Returning this configurator:
      return this;
   }



   /**
    * Serves a static directory or file, on the given server route
    * @param  {string} route         The server route
    * @param  {string} resource_path The relative file/directory path
    * @return {Configurator}         This configurator (for method chaining)
    */
   serve(route, resource_path){
      // *Resolving the caller method '__dirname':
      let caller_dir = path.dirname(stack()[1].getFileName());
      // *Adding this resource into the array:
      this._static_resources.push({route, path: path.join(caller_dir, resource_path)});
      // *Returning this configurator:
      return this;
   }



   /**
    * Registers a middleware for a specific route and HTTP method
    * @param  {string} method                  An HTTP method (GET, POST, PUT, DELETE, OPTIONS)
    * @param  {string} route                   The server route
    * @param  {function|function[]} middleware A valid Expressjs middleware function
    * @return {Configurator}                   This configurator (for method chaining)
    */
   api(method, route, middleware){
      // *Adding this resource into the array:
      this._api_resources.push({method, route, middleware});
      // *Returning this configurator:
      return this;
   }



   /**
    * Registers a middleware for a specific GET route
    * @param  {string} route                   The server route
    * @param  {function|function[]} middleware A valid Expressjs middleware function
    * @return {Configurator}                   This configurator (for method chaining)
    */
   apiGET(route, middleware){
      return this.api(Configurator.METHODS.GET, route, middleware);
   }



   /**
    * Registers a middleware for a specific POST route
    * @param  {string} route                   The server route
    * @param  {function|function[]} middleware A valid Expressjs middleware function
    * @return {Configurator}                   This configurator (for method chaining)
    */
   apiPOST(route, middleware){
      return this.api(Configurator.METHODS.POST, route, middleware);
   }



   /**
    * Registers a middleware for a specific PUT route
    * @param  {string} route                   The server route
    * @param  {function|function[]} middleware A valid Expressjs middleware function
    * @return {Configurator}                   This configurator (for method chaining)
    */
   apiPUT(route, middleware){
      return this.api(Configurator.METHODS.PUT, route, middleware);
   }



   /**
    * Registers a middleware for a specific DELETE route
    * @param  {string} route                   The server route
    * @param  {function|function[]} middleware A valid Expressjs middleware function
    * @return {Configurator}                   This configurator (for method chaining)
    */
   apiDELETE(route, middleware){
      return this.api(Configurator.METHODS.DELETE, route, middleware);
   }



   /**
    * Starts the server instance
    * @return {Promise} The promise resolves into an info object containing the 'address' of the server, or it rejects if the server could not be started
    */
   start(){
      // *Checking if the server start promise is set, and if it is, returning it:
      if(this._server_start_promise) return this._server_start_promise;

      // *Setting the server start promise:
      this._server_start_promise = boot_server.start({
            server_port: this._server_port,
            spa_file: this._spa_file,
            static_resources: this._static_resources,
            api_resources: this._api_resources
         })
         .then(info => {
            // *Cleaning the stop promise, so it can be stopped again:
            this._server_stop_promise = null;
            // *Returning the info into the promise chain:
            return info;
         });

      // *Returning the server start promise:
      return this._server_start_promise;
   }



   /**
    * Stops the current server instance
    * @return {Promise} The promise resolves if the server could be stopped, or rejects if something goes bad
    */
   stop(){
      // *Checking if the server stop promise is set, and if it is, returning it:
      if(this._server_stop_promise) return this._server_stop_promise;

      // *Setting the server stop promise:
      this._server_stop_promise = boot_server.stop()
         .then(info => {
            // *Cleaning the start promise, so it can be started again:
            this._server_start_promise = null;
            // *Returning the info into the promise chain:
            return info;
         });

      // *Returning the server stop promise:
      return this._server_stop_promise;
   }

}
