// *Requiring the needed modules:
const { isMethodSupported } = require('./methods.js');
const AdvancedAPIConfigurator = require('./advanced-api-configurator.js');



/**
 * Represents an API resource
 */
module.exports = class APIResource{

   /**
    * Creates a new API resource
    * @param  {string} method                    A supported HTTP method (GET, POST, PUT, DELETE)
    * @param  {string} route                     The server route
    * @param  {function|function[]} middleware   A valid Expressjs middleware function
    * @param  {AdvancedAPIConfigurator} advanced The advanced settings configurator
    * @throws {TypeError}                        If the method is not a string
    * @throws {Error}                            If the method is not one of the supported HTTP methods
    * @throws {TypeError}                        If the advanced configurator is not the correct type
    */
   constructor(method, route, middleware, advanced){
      // *Checking if the method is a string, throwing an error if it isn't:
      if(!(typeof method === 'string'))
         throw new TypeError('The \"method\" must be a string');

      // *Making the method name uppercase:
      method = method.toUpperCase();

      // *Checking if the given method is supported, and if it's not, throwing an error:
      if(!isMethodSupported(method))
         throw new Error('The \"' + method +'\" is not a supported HTTP method');

      // *Setting this object's attributes:
      this._method = method;
      this._route = route;
      this._middleware = middleware;
      this.advanced = advanced;
   }



   /**
    * The HTTP method
    * @readonly
    * @type {string}
    */
   get method(){
      return this._method;
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
    * The middleware function
    * @readonly
    * @type {function|function[]}
    */
   get middleware(){
      return this._middleware;
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
