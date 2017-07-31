// *Requiring the needed modules:
const StaticConfigurator = require('./static-configurator');
const APIConfigurator = require('./api-configurator');
const boot_server = require('./booting/server');
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
      this._server_port = null;

      /**
       * Secure (HTTPS) server options
       * @type {object}
       */
      this._secure = null;

      /**
       * The Express locals object
       * @type {object}
       */
      this._locals = null;

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

      /**
       * The hooks event emitter
       * @type {EventEmitter}
       */
      this._ee = new EventEmitter();

      /**
       * The sockets map
       *  key: the socket id
       *  value: the socket itself
       * @type {Map<number,net.Socket>}
       */
      this._sockets = new Map();

      /**
       * The server instance
       * @type {http.Server|https.Server}
       */
      this._server = null;
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
    * Switches the server to use HTTPS
    * @param  {object} options            HTTPS configurations
    * @param  {string} options.cert       The HTTPS certificate
    * @param  {string} options.key        The HTTPS key
    * @param  {string} options.pfx        The HTTPS pfx
    * @param  {string} options.passphrase The HTTPS pfx password
    * @param  {boolean} is_file           Whether the options values are filenames, and should be retrieved from disk
    * @return {Configurator}              This configurator (for method chaining)
    */
   https(options, is_file){
      // *Initializing the secure options object:
      this._secure = {};

      // *Setting the secure options:
      this._secure.key        = is_file && options.key        ? fs.readFileSync(options.key, 'utf8')        : options.key;
      this._secure.cert       = is_file && options.cert       ? fs.readFileSync(options.cert, 'utf8')       : options.cert;
      this._secure.pfx        = is_file && options.pfx        ? fs.readFileSync(options.pfx)                : options.pfx;
      this._secure.passphrase = is_file && options.passphrase ? fs.readFileSync(options.passphrase, 'utf8') : options.passphrase;

      // *Returning this configurator:
      return this;
   }



   /**
    * Sets a new property in the Express 'locals' (or the entire 'locals' object)
    *  If an object is passed, it will override the 'locals' object
    *  Otherwise, the arguments will be processed as a key and a value, and they will be merged into the 'locals' object
    * @param  {object|string} key The key of the value, or the entire 'locals' object
    * @param  {*} value           The value for the given key
    * @return {Configurator}      This configurator (for method chaining)
    */
   locals(key, value){
      // *Checking if the first argument is an object:
      if(arguments[0] && typeof arguments[0] === 'object'){
         // *If it is:
         // *Replacing the locals:
         this._locals = arguments[0];
      } else{
         // *If it isn't:
         // *Initializing the locals, if it isn't an object:
         this._locals = this._locals && typeof this._locals === 'object' ? this._locals : {};
         // *Setting the key-value in the locals:
         this._locals[key] = value;
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
      // *Checking if the server start promise isn't set yet:
      if(!this._server_start_promise)
         // *If it isn't:
         // *Setting the server start promise, and starting the server:
         this._server_start_promise = boot_server.startServer({
               not_found_middlewares: this._not_found_middlewares,
               static_resources:      this._static.resources,
               api_resources:         this._api.resources,
               server_port:           this.server_port,
               secure:                this._secure,
               locals:                this._locals,
               index:                 this._static._index
            }, this._ee, this._sockets)
            // *When the server starts:
            .then(output => {
               // *Setting the server instance:
               this._server = output.server;
               // *Cleaning the stop promise, so it can be stopped again:
               this._server_stop_promise = null;
               // *Returning the output into the promise chain:
               return output;
            })
            // *Handling exceptions:
            .catch(err => {
               // *If something went wrong:
               // *Stopping the service:
               return this.stop()
                  // *Rejecting the promise chain:
                  .then(() => Promise.reject(err));
            });

      // *Returning the server start promise:
      return this._server_start_promise;
   }



   /**
    * Stops the current server instance
    * @return {Promise} The promise resolves if the server could be stopped, or rejects if something goes bad
    */
   stop(){
      // *Checking if the server stop promise isn't set yet:
      if(!this._server_stop_promise)
         // *If it isn't:
         // *Setting the server stop promise, and stopping the server:
         this._server_stop_promise = boot_server.stopServer(this._server, this._sockets)
            // *When the server stops:
            .then(output => {
               // *Resetting the server instance:
               this._server = null;
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
      // *Checking if the server port is set:
      if(this._server_port === null || this._server_port === undefined)
         // *If it isn't:
         // *Returning the default server port for the current protocol (HTTPS or HTTP):
         return this._secure ? 443 : 80;

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
