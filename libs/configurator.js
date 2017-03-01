// *Requiring the needed modules:
const StaticConfigurator = require('./static-configurator.js');
const APIConfigurator = require('./api-configurator.js');
const boot_server = require('./boot-server.js');



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

      // *Initializing the inner configurators:
      this._static = new StaticConfigurator(this);
      this._api = new APIConfigurator(this);

      // *Declaring the server promises:
      this._server_start_promise = null;
      this._server_stop_promise = null;
   }



   /**
    * Retrieves the supported HTTP methods enum
    */
   static get METHODS(){
      // *Returning the enum:
      return APIConfigurator.METHODS;
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
    * Starts the server instance
    * @return {Promise} The promise resolves into an info object containing the 'address' of the server, or it rejects if the server could not be started
    */
   start(){
      // *Checking if the server start promise is set, and if it is, returning it:
      if(this._server_start_promise) return this._server_start_promise;

      // *Setting the server start promise:
      this._server_start_promise = boot_server.start({
            server_port: this._server_port,
            spa_file: this._static.spa_file,
            static_resources: this._static.resources,
            api_resources: this._api.resources
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



   /**
    * Retrieves the inner configurator for static resources
    * @return {StaticConfigurator} The configurator
    */
   get static(){
      // *Returning the inner configurator:
      return this._static;
   }



   /**
    * Retrieves the inner configurator for dynamic resources
    * @return {APIConfigurator} The configurator
    */
   get api(){
      // *Returning the inner configurator:
      return this._api;
   }

};
