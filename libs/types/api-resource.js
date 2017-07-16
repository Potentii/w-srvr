// *Requiring the needed modules:
const { isMethodSupported } = require('../utils/methods');
const AdvancedAPIConfigurator = require('../advanced-api-configurator');



/**
 * Represents an API resource
 */
module.exports = class APIResource{

   /**
    * Creates a new API resource
    * @param  {string|string[]} methods          One or more supported HTTP methods
    * @param  {string} route                     The server route
    * @param  {function|function[]} middleware   A valid Expressjs middleware function
    * @param  {AdvancedAPIConfigurator} advanced The advanced settings configurator
    * @throws {TypeError}                        If methods is not a string or an array of strings
    * @throws {Error}                            If some HTTP method is not supported
    * @throws {TypeError}                        If the advanced configurator is not the correct type
    * @see {@link Configurator.METHODS}          For a list of supported HTTP methods
    */
   constructor(methods, route, middleware, advanced){
      // *Splitting 'methods' if it is a string:
      if(typeof methods === 'string')
         methods = methods.split(',');

      // *Checking if 'methods' is an array of strings, throwing an error if it's not:
      if(!Array.isArray(methods) || !methods.every(m => typeof m === 'string'))
         throw new TypeError('The \"methods\" must be a string, or an array of strings');

      // *Making the methods names uppercase:
      methods = methods.map(m => m.toUpperCase());

      // *Checking if all methods are supported, and if some isn't, throwing an error:
      if(methods.some(m => !isMethodSupported(m)))
         throw new Error('Some of the following HTTP methods: \"[' + methods.join(', ') + ']\" are not supported');

      middleware = middleware === undefined || middleware === null ? [] : middleware;

      // *Setting this object's attributes:
      this._methods = methods;
      this._route = route;
      this._middlewares = Array.isArray(middleware) ? middleware : [middleware];
      this.advanced = advanced;
   }



   /**
    * The list of HTTP methods
    * @readonly
    * @type {string[]}
    */
   get methods(){
      return this._methods;
   }



   /**
    * The server route
    * @readonly
    * @type {string}
    */
   get route(){
      return this._route;
   }



   /**
    * The middlewares functions
    * @readonly
    * @type {function[]}
    */
   get middlewares(){
      return this._middlewares;
   }



   /**
    * The advanced settings configurator
    * @type {AdvancedAPIConfigurator}
    */
   get advanced(){
      return this._advanced;
   }



   /**
    * Sets a new advanced settings configurator
    * @param {AdvancedAPIConfigurator} [configurator] The new configurator
    * @throws {TypeError}                             If the configurator is not the correct type
    */
   set advanced(configurator){
      // *Checking if the configurator is set and if it is an 'AdvancedAPIConfigurator', throwing an error if it's not:
      if(configurator && !(configurator instanceof AdvancedAPIConfigurator))
         throw new TypeError('The advanced configurator must be an \"AdvancedAPIConfigurator\" object');

      this._advanced = configurator;
   }

};
