// *Getting the needed dependencies:
const middlewares_util = require('../utils/middlewares');
const APIResource = require('../types/api-resource');
const headers_util = require('../utils/headers');
const { METHODS } = require('../utils/methods');



/**
 * Builds a new API resource for handling CORS preflight flow
 * @param  {APIResource} api_resource The actual resource
 * @return {APIResource}              The new preflight API resource if the given resource needs it, null otherwise
 */
function getPreflightResource(api_resource){
   // *Checking if advanced settings were set:
   if(api_resource.advanced){
      // *If it were:
      // *Getting the headers:
      const headers = api_resource.advanced.headers;

      // *Checking if there are headers set:
      if(headers.length){
         // *If there are:
         // *Getting only the preflight headers:
         const preflight_headers = headers.filter(h => headers_util.isPreflight(h.name));

         // *Checking if there are preflight headers set:
         if(preflight_headers.length){
            // *If there are:
            // *Building a new API resource to handle the preflight flow on this route:
            const preflight = new APIResource(METHODS.OPTIONS, api_resource.route);
            // *Adding a middleware that will insert the preflight headers into the response:
            preflight.middlewares.push(middlewares_util.headersMiddleware(preflight_headers));
            // *Adding a middleware that will simply respond with status '200 OK':
            preflight.middlewares.push(middlewares_util.statusMiddleware(200));
            // *Returning the new preflight resource:
            return preflight;
         }
      }
   }
}



/**
 * Adds the headers flow into the given API resource
 * @param  {APIResource} api_resource The actual resource
 */
function addHeadersFlow(api_resource){
   // *Checking if advanced settings were set:
   if(api_resource.advanced){
      // *If it were:
      // *Getting the headers:
      const headers = api_resource.advanced.headers;

      // *Checking if there are headers set:
      if(headers.length){
         // *If there are:
         // *Getting the headers that are not intended to be used just only in preflight responses:
         const normal_headers = headers.filter(h => headers_util.isNotOnlyPreflight(h.name));
         // *Checking if there are normal headers set:
         if(normal_headers.length){
            // *If there are:
            // *Adding a middleware that will insert the headers into the response:
            api_resource.middlewares.unshift(middlewares_util.headersMiddleware(normal_headers));
         }
      }
   }
}



/**
 * Adds the parsing flow into the given API resource
 * @param  {APIResource} api_resource The actual resource
 */
function addParsingFlow(api_resource){
   // *Checking if advanced settings were set:
   if(api_resource.advanced){
      // *If it were:
      // *Getting the parsers:
      const parsers = api_resource.advanced.parsers;

      // *Checking if there are parsers set:
      if(parsers.length){
         // *If there are:
         // *Getting each parser set:
         for(let parser of parsers){
            // *Adding a middleware that will parse the request body:
            api_resource.middlewares.unshift(parser.buildMiddleware());
         }
      }
   }
}



// *Exporting this module:
module.exports = {
   getPreflightResource,
   addParsingFlow,
   addHeadersFlow
};
