// *Requiring the needed modules:
const { PARSERS } = require('./parsers.js');



/**
 * Represents a set of advanced API settings
 */
module.exports = class AdvancedAPIConfigurator{

   /**
    * Creates a new advanced API configurator
    * @param {APIConfigurator} api_configurator The api configurator reference
    */
   constructor(api_configurator){
      /**
       * The api configurator
       * @private
       * @type {APIConfigurator}
       */
      this._api_configurator = api_configurator;

      /**
       * The headers map
       *  Key: The header name
       *  Value: The header value
       * @private
       * @type {Map}
       */
      this._headers = new Map();

      /**
       * The parsers settings map
       *  Key: The parser type ('json', 'raw', 'text' or 'urlencoded')
       *  Value: The parser options object
       * @private
       * @type {Map}
       */
      this._parsers = new Map();
   }



   /**
    * Sets a header value
    *  If the header is already set in this resource, its value will be replaced
    * @param  {string} name             The header name
    * @param  {string} value            The header value
    * @return {AdvancedAPIConfigurator} This configurator (for method chaining)
    */
   header(name, value){
      // *Adding the header in the map:
      this._headers.set(name, value);
      // *Returning this configurator:
      return this;
   }



   /**
    * Sets which origins are allowed to make CORS requests
    *  It just adds an 'Access-Control-Allow-Origin' header
    * @param  {...string} origins       The allowed origins
    * @return {AdvancedAPIConfigurator} This configurator (for method chaining)
    * @see {@link https://fetch.spec.whatwg.org/#http-access-control-allow-origin}
    */
   allowedOrigins(...origins){
      // *Setting the origins allowed header:
      return this.header('Access-Control-Allow-Origin', origins.join(', '));
   }



   /**
    * Sets which HTTP methods are allowed in CORS requests
    *  It just adds an 'Access-Control-Allow-Methods' header
    * @param  {...string} methods       The allowed HTTP methods
    * @return {AdvancedAPIConfigurator} This configurator (for method chaining)
    * @see {@link https://fetch.spec.whatwg.org/#http-access-control-allow-methods}
    */
   allowedMethods(...methods){
      // *Setting the HTTP methods allowed header:
      return this.header('Access-Control-Allow-Methods', methods.join(', '));
   }



   /**
    * Sets which headers are allowed in CORS requests
    *  It just adds an 'Access-Control-Allow-Headers' header
    * @param  {...string} headers       The allowed headers names
    * @return {AdvancedAPIConfigurator} This configurator (for method chaining)
    * @see {@link https://fetch.spec.whatwg.org/#http-access-control-allow-headers}
    */
   allowedHeaders(...headers){
      // *Setting the allowed headers:
      return this.header('Access-Control-Allow-Headers', headers.join(', '));
   }



   /**
    * Sets which headers should be exposed in CORS responses
    *  It just adds an 'Access-Control-Expose-Headers' header
    * @param  {...string} headers       The exposed headers names
    * @return {AdvancedAPIConfigurator} This configurator (for method chaining)
    * @see {@link https://fetch.spec.whatwg.org/#http-access-control-expose-headers}
    */
   exposedHeaders(...headers){
      // *Setting the exposed headers:
      return this.header('Access-Control-Expose-Headers', headers.join(', '));
   }



   /**
    * Sets for how long a CORS preflight response should be cached by the client
    *  It just adds an 'Access-Control-Max-Age' header
    * @param  {number|string} seconds   The time in seconds
    * @return {AdvancedAPIConfigurator} This configurator (for method chaining)
    * @see {@link https://fetch.spec.whatwg.org/#http-access-control-max-age}
    */
   preflightMaxAge(seconds){
      // *Setting the exposed headers:
      return this.header('Access-Control-Max-Age', String(seconds));
   }



   /**
    * Sets the response body type
    *  It just adds a 'Content-Type' header
    * @param  {string} type             The MIME type of the response body
    * @return {AdvancedAPIConfigurator} This configurator (for method chaining)
    * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type}
    */
   responseType(type){
      // *Setting the response body type header:
      return this.header('Content-Type', String(type));
   }



   /**
    * Enables the JSON request body parsing
    * @param  {object} [options]        The body-parser options object
    * @return {AdvancedAPIConfigurator} This configurator (for method chaining)
    * @see {@link https://github.com/expressjs/body-parser#bodyparserjsonoptions}
    */
   parseJSON(options){
      // *Setting the parser options:
      this._parsers.set(PARSERS.JSON, options);
      // *Returning this configurator:
      return this;
   }



   /**
    * Enables the text request body parsing
    * @param  {object} [options]        The body-parser options object
    * @return {AdvancedAPIConfigurator} This configurator (for method chaining)
    * @see {@link https://github.com/expressjs/body-parser#bodyparsertextoptions}
    */
   parseText(options){
      // *Setting the parser options:
      this._parsers.set(PARSERS.TEXT, options);
      // *Returning this configurator:
      return this;
   }



   /**
    * Enables the raw (buffer) request body parsing
    * @param  {object} [options]        The body-parser options object
    * @return {AdvancedAPIConfigurator} This configurator (for method chaining)
    * @see {@link https://github.com/expressjs/body-parser#bodyparserrawoptions}
    */
   parseRaw(options){
      // *Setting the parser options:
      this._parsers.set(PARSERS.RAW, options);
      // *Returning this configurator:
      return this;
   }



   /**
    * Enables the url-encoded request body parsing
    * @param  {object} [options]        The body-parser options object
    * @return {AdvancedAPIConfigurator} This configurator (for method chaining)
    * @see {@link https://github.com/expressjs/body-parser#bodyparserurlencodedoptions}
    */
   parseURLEncoded(options){
      // *Setting the parser options:
      this._parsers.set(PARSERS.URLENCODED, options);
      // *Returning this configurator:
      return this;
   }



   /**
    * Retrieves the API configurator
    * @return {APIConfigurator}  The API configurator (for configurator chaining)
    */
   done(){
      // *Restarting the APIConfigurator chain:
      this._api_configurator._outOfRouteChain();
      // *Returning the configurator:
      return this._api_configurator;
   }



   /**
    * The headers list
    * @readonly
    * @return {Array} An array containing { name, value } objects
    */
   get headers(){
      // *Starting the list:
      let headers = [];
      // *Filling the list with the map's content:
      this._headers.forEach((v, k) => headers.push({name: k, value: v}));
      // *Returning the list:
      return headers;
   }



   /**
    * The parsers list
    * @readonly
    * @return {Array} An array containing { type, options } objects
    */
   get parsers(){
      // *Starting the list:
      let parsers = [];
      // *Filling the list with the map's content:
      this._parsers.forEach((v, k) => parsers.push({type: k, options: v}));
      // *Returning the list:
      return parsers;
   }

};
