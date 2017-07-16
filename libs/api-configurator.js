// *Requiring the needed modules:
const { METHODS, isMethodSupported } = require('./utils/methods');
const APIResource = require('./types/api-resource');
const AdvancedAPIConfigurator = require('./advanced-api-configurator');



/**
 * Represents a set of API resources
 */
module.exports = class APIConfigurator{

   /**
    * Creates a new API configurator
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
       * API resources
       * @private
       * @type {APIResource[]}
       */
      this._resources = [];

      /**
       * A flag that informs whether this configurator is in a route chain
       *  Other configurators might control this flag's state with _outOfRouteChain()
       * @private
       * @type {boolean}
       */
      this._isInRouteChain = false;
   }



   /**
    * Retrieves the supported HTTP methods enum
    * @readonly
    * @static
    */
   static get METHODS(){
      // *Returning the enum:
      return METHODS;
   }



   /**
    * Starts an advanced configurator chain for the last added route
    *  Must be called only right after a route has been added
    * @readonly
    * @return {AdvancedAPIConfigurator} The advanced configurator of the last added route
    * @throws {Error}                   If it's not being called right after a route has been added
    */
   get advanced(){
      // *Getting the last added resource:
      let last_res = this._resources[this._resources.length-1];

      // *Checking if the advanced chain is available, throwing an error if it's not:
      if(!this._isInRouteChain || !last_res)
         throw new Error('The \"advanced\" call must be chained only right after a route has been added');

      // *Declaring the advanced configurator:
      let advanced;

      // *Checkin if the resource already has an advanced configurator set:
      if(last_res.advanced){
         // *If it has:
         // *Getting it:
         advanced = last_res.advanced
      } else{
         // *If it hasn't:
         // *Creating a new one:
         advanced = new AdvancedAPIConfigurator(this);
         // *Assigning the resource's one:
         last_res.advanced = advanced;
      }

      // *Changing the route chain status:
      this._isInRouteChain = false;

      // *Returning the advanced configurator:
      return advanced;
   }



   /**
    * Registers a middleware for the given route and HTTP methods
    * @param  {string|string[]} methods        One or more supported HTTP methods
    * @param  {string} route                   The server route
    * @param  {function|function[]} middleware A valid Expressjs middleware function
    * @return {APIConfigurator}                This configurator (for method chaining)
    * @throws {TypeError}                      If methods is not a string or an array of strings
    * @throws {Error}                          If some HTTP method is not supported
    * @see {@link Configurator.METHODS}        For a list of supported HTTP methods
    */
   add(methods, route, middleware){
      // *Adding this resource into the array:
      this._resources.push(new APIResource(methods, route, middleware, null));

      // *Changing the chain flag status:
      this._isInRouteChain = true;

      // *Returning this configurator:
      return this;
   }



   /**
    * Registers a middleware for the given GET route
    *  Same as add() with the HTTP method set to 'GET'
    * @param  {string} route                   The server route
    * @param  {function|function[]} middleware A valid Expressjs middleware function
    * @return {APIConfigurator}                This configurator (for method chaining)
    */
   get(route, middleware){
      return this.add(APIConfigurator.METHODS.GET, route, middleware);
   }



   /**
    * Registers a middleware for the given POST route
    *  Same as add() with the HTTP method set to 'POST'
    * @param  {string} route                   The server route
    * @param  {function|function[]} middleware A valid Expressjs middleware function
    * @return {APIConfigurator}                This configurator (for method chaining)
    */
   post(route, middleware){
      return this.add(APIConfigurator.METHODS.POST, route, middleware);
   }



   /**
    * Registers a middleware for the given PUT route
    *  Same as add() with the HTTP method set to 'PUT'
    * @param  {string} route                   The server route
    * @param  {function|function[]} middleware A valid Expressjs middleware function
    * @return {APIConfigurator}                This configurator (for method chaining)
    */
   put(route, middleware){
      return this.add(APIConfigurator.METHODS.PUT, route, middleware);
   }



   /**
    * Registers a middleware for the given DELETE route
    *  Same as add() with the HTTP method set to 'DELETE'
    * @param  {string} route                   The server route
    * @param  {function|function[]} middleware A valid Expressjs middleware function
    * @return {APIConfigurator}                This configurator (for method chaining)
    */
   delete(route, middleware){
      return this.add(APIConfigurator.METHODS.DELETE, route, middleware);
   }



   /**
    * Registers a middleware for the given HEAD route
    *  Same as add() with the HTTP method set to 'HEAD'
    * @param  {string} route                   The server route
    * @param  {function|function[]} middleware A valid Expressjs middleware function
    * @return {APIConfigurator}                This configurator (for method chaining)
    */
   head(route, middleware){
      return this.add(APIConfigurator.METHODS.HEAD, route, middleware);
   }



   /**
    * Registers a middleware for the given PATCH route
    *  Same as add() with the HTTP method set to 'PATCH'
    * @param  {string} route                   The server route
    * @param  {function|function[]} middleware A valid Expressjs middleware function
    * @return {APIConfigurator}                This configurator (for method chaining)
    */
   patch(route, middleware){
      return this.add(APIConfigurator.METHODS.PATCH, route, middleware);
   }



   /**
    * Registers a middleware for the given OPTIONS route
    *  Same as add() with the HTTP method set to 'OPTIONS'
    * @param  {string} route                   The server route
    * @param  {function|function[]} middleware A valid Expressjs middleware function
    * @return {APIConfigurator}                This configurator (for method chaining)
    */
   options(route, middleware){
      return this.add(APIConfigurator.METHODS.OPTIONS, route, middleware);
   }



   /**
    * Registers a middleware for all supported HTTP methods
    *  Same as add() with all the supported HTTP methods
    *  This method is not equivalent to the Expressjs's app.all()
    * @param  {string} route                   The server route
    * @param  {function|function[]} middleware A valid Expressjs middleware function
    * @return {APIConfigurator}                This configurator (for method chaining)
    * @see {@link Configurator.METHODS}        For a list of supported HTTP methods
    */
   all(route, middleware){
      // *Initializing the methods list:
      let methods = [];

      // *Adding all the supported methods in the list:
      for(let method_name in APIConfigurator.METHODS){
         if(APIConfigurator.METHODS.hasOwnProperty(method_name)){
            methods.push(APIConfigurator.METHODS[method_name])
         }
      }

      return this.add(methods, route, middleware);
   }



   /**
    * Registers a middleware for GET, POST, PUT, DELETE, HEAD and PATCH routes
    *  Same as add() with the HTTP method set to 'GET', 'POST', 'PUT', 'DELETE', 'HEAD' and 'PATCH'
    *  This method is not equivalent to the Expressjs's app.all()
    * @param  {string} route                   The server route
    * @param  {function|function[]} middleware A valid Expressjs middleware function
    * @return {APIConfigurator}                This configurator (for method chaining)
    */
   most(route, middleware){
      return this.add([
         APIConfigurator.METHODS.GET,
         APIConfigurator.METHODS.POST,
         APIConfigurator.METHODS.PUT,
         APIConfigurator.METHODS.DELETE,
         APIConfigurator.METHODS.HEAD,
         APIConfigurator.METHODS.PATCH,
      ], route, middleware);
   }



   /**
    * Retrieves the main configurator
    * @return {Configurator}  The main configurator (for configurator chaining)
    */
   done(){
      return this._main_configurator;
   }



   /**
    * Resets the API route chain flag, so 'advanced' chains can't be created
    *  Should only be used by configurators that have an APIConfigurator
    * @private
    */
   _outOfRouteChain(){
      // *Changing the route chain state:
      this._isInRouteChain = false;
   }



   /**
    * Retrieves the API resources
    * @readonly
    * @type {APIResource[]}
    */
   get resources(){
      return this._resources.concat([]);
   }

};
