// *Requiring the needed modules:
const StaticConfigurator = require('./static-configurator');
const APIConfigurator = require('./api-configurator');
const boot_server = require('./boot-server');
const { HOOKS } = require('./utils/hooks');
const EventEmitter = require('events');
const fs = require('fs');



/**
 * Represents a configurable server initializer
 */
module.exports = class Configurator{

   /**
    * Creates a new configurator
    */
   constructor(){
      /**
       * The server port
       * @private
       * @type {number|string}
       */
      this._server_port = 80;

      /**
       * Secure (HTTPS) server options
       * @type {object}
       */
      this._secure = null;

      /**
       * Inner configurator for static resources
       * @private
       * @type {StaticConfigurator}
       */
      this._static = new StaticConfigurator(this);

      /**
       * Inner configurator for dynamic resources
       * @private
       * @type {APIConfigurator}
       */
      this._api = new APIConfigurator(this);

      /**
       * The express middlewares to handle 404 status
       * @private
       * @type {function[]}
       */
      this._not_found_middlewares = [];

      /**
       * The start server task promise
       * @private
       * @type {Promise}
       */
      this._server_start_promise = null;

      /**
       * The stop server task promise
       * @private
       * @type {Promise}
       */
      this._server_stop_promise = null;

      this._ee = new EventEmitter();
   }



   /**
    * Retrieves the supported HTTP methods enum
    * @readonly
    * @static
    * @enum {string}
    */
   static get METHODS(){
      // *Returning the enum:
      return APIConfigurator.METHODS;
   }



   /**
    * Retrieves the available hook events enum
    * @readonly
    * @static
    * @enum {string}
    */
   static get HOOKS(){
      // *Returning the enum:
      return HOOKS;
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
    * Registers middlewares to handle 404 responses
    * @param {function|function[]} middleware A valid Expressjs middleware function
    * @return {Configurator}                  This configurator (for method chaining)
    */
   notFound(middleware){
      // *Checking if the middleware is set:
      if(middleware){
         // *Checking if the middleware is an array:
         if(Array.isArray(middleware)){
            // *If it is:
            // *Adding its items individualy in the list:
            this._not_found_middlewares.push(...middleware);
         } else{
            // *If it isn't:
            // *Adding it in the list:
            this._not_found_middlewares.push(middleware);
         }
      }
      // *Returning this configurator:
      return this;
   }



   /**
    * Swicthes the server to use HTTPS
    * @param  {object} options            HTTPS configurations
    * @param  {string} options.cert       The HTTPS certificate
    * @param  {string} options.key        The HTTPS key
    * @param  {string} options.pfx        The HTTPS pfx
    * @param  {string} options.passphrase The HTTPS pfx password
    * @param  {boolean} is_file           Whether the options values are filenames, and should be retrieved from disk
    * @return {Configurator}              This configurator (for method chaining)
    */
   HTTPS(options, is_file){
      // *Initializing the secure options object:
      this._secure = {};

      // *Setting the secure options:
      this._secure.key        = options.key;
      this._secure.cert       = options.cert;
      this._secure.pfx        = options.pfx;
      this._secure.passphrase = options.passphrase;

      // *Checking if the file flag was set:
      if(is_file){
         // *If it was:
         // *Getting each secure option:
         for(let config_prop in this._secure){
            if(this._secure.hasOwnProperty(config_prop)){
               // *Reading the file and then setting the content in the object:
               this._secure[config_prop] = fs.readFileSync(this._secure[config_prop], 'utf8');
            }
         }
      }

      // *Returning this configurator:
      return this;
   }



   /**
    * Registers a handler for a given event
    * @param  {string} event      The event name
    * @param  {function} listener The handler function
    * @return {Configurator}      This configurator (for method chaining)
    */
   on(event, listener){
      // *Registering the handler in the internal event emitter:
      this._ee.on(event, listener);
      // *Returning this configurator:
      return this;
   }



   /**
    * Starts the server instance
    * @return {Promise} The promise resolves into an { address, server} object, or it rejects if the server could not be started
    */
   start(){
      // *Checking if the server start promise is set, and if it is, returning it:
      if(this._server_start_promise) return this._server_start_promise;

      // *Setting the server start promise:
      this._server_start_promise = boot_server.start({
            server_port: this._server_port,
            secure: this._secure,
            not_found_middlewares: this._not_found_middlewares,
            index: this._static._index,
            static_resources: this._static.resources,
            api_resources: this._api.resources,
            ee: this._ee
         })
         .then(output => {
            // *Cleaning the stop promise, so it can be stopped again:
            this._server_stop_promise = null;
            // *Returning the output into the promise chain:
            return output;
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
         .then(output => {
            // *Cleaning the start promise, so it can be started again:
            this._server_start_promise = null;
            // *Returning the output into the promise chain:
            return output;
         });

      // *Returning the server stop promise:
      return this._server_stop_promise;
   }



   /**
    * Retrieves the server port
    * @readonly
    * @type {number|string}
    */
   get server_port(){
      // *Returning the server port:
      return this._server_port;
   }



   /**
    * Retrieves the inner configurator for static resources
    * @readonly
    * @type {StaticConfigurator}
    */
   get static(){
      // *Returning the inner configurator:
      return this._static;
   }



   /**
    * Retrieves the inner configurator for dynamic resources
    * @readonly
    * @type {APIConfigurator}
    */
   get api(){
      // *Reseting the route chain state in the APIConfigurator:
      this._api._outOfRouteChain();
      // *Returning the inner configurator:
      return this._api;
   }

};
