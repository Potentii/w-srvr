// *Requiring the needed modules:
const { METHODS, isMethodSupported } = require('./methods.js');



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
       * @type {Array}
       */
      this._resources = [];
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
    * Registers a middleware for the given route and HTTP method
    * @param  {string} method                  A supported HTTP method (GET, POST, PUT, DELETE)
    * @param  {string} route                   The server route
    * @param  {function|function[]} middleware A valid Expressjs middleware function
    * @return {APIConfigurator}                This configurator (for method chaining)
    * @throws {TypeError}                      The method parameter must be a string
    * @throws {Error}                          The method parameter must be a supported HTTP method name
    */
   add(method, route, middleware){
      // *Checking if the method is a string, throwing an error if it isn't:
      if(!(typeof method === 'string'))
         throw new TypeError('The \"method\" must be a string');

      // *Making the method name upper case:
      method = method.toUpperCase();

      // *Checking if the given method is supported, and if it's not, throwing an error:
      if(!isMethodSupported(method))
         throw new Error('The \"' + method +'\" is not a supported HTTP method');

      // *Adding this resource into the array:
      this._resources.push({ method, route, middleware });

      // *Returning this configurator:
      return this;
   }



   /**
    * Registers a middleware for the given GET route
    * @param  {string} route                   The server route
    * @param  {function|function[]} middleware A valid Expressjs middleware function
    * @return {APIConfigurator}                This configurator (for method chaining)
    */
   get(route, middleware){
      return this.add(APIConfigurator.METHODS.GET, route, middleware);
   }



   /**
    * Registers a middleware for the given POST route
    * @param  {string} route                   The server route
    * @param  {function|function[]} middleware A valid Expressjs middleware function
    * @return {APIConfigurator}                This configurator (for method chaining)
    */
   post(route, middleware){
      return this.add(APIConfigurator.METHODS.POST, route, middleware);
   }



   /**
    * Registers a middleware for the given PUT route
    * @param  {string} route                   The server route
    * @param  {function|function[]} middleware A valid Expressjs middleware function
    * @return {APIConfigurator}                This configurator (for method chaining)
    */
   put(route, middleware){
      return this.add(APIConfigurator.METHODS.PUT, route, middleware);
   }



   /**
    * Registers a middleware for the given DELETE route
    * @param  {string} route                   The server route
    * @param  {function|function[]} middleware A valid Expressjs middleware function
    * @return {APIConfigurator}                This configurator (for method chaining)
    */
   delete(route, middleware){
      return this.add(APIConfigurator.METHODS.DELETE, route, middleware);
   }



   /**
    * Retrieves the main configurator
    * @return {Configurator}  The main configurator (for method chaining)
    */
   done(){
      return this._main_configurator;
   }



   /**
    * Retrieves the API resources
    * @readonly
    * @return {Array} An array containing '{ method, route, middleware }' objects
    */
   get resources(){
      return this._resources.concat([]);
   }

};
