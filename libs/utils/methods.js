/**
 * Supported HTTP methods
 * @readonly
 * @enum {string}
 */
const METHODS_ENUM = Object.freeze({
   GET: 'GET', POST: 'POST', PUT: 'PUT', DELETE: 'DELETE', HEAD: 'HEAD', PATCH: 'PATCH', OPTIONS: 'OPTIONS'
});



/**
 * Checks if the given method is supported
 * @param  {string}  method The HTTP method
 * @return {Boolean}        Whether the given method is supported or not
 */
function isMethodSupported(method){
   // *Returning false if the method isn't a string:
   if(typeof method !== 'string') return false;

   // *Getting the method as upper case:
   method = method.toUpperCase();

   // *Getting each of the methods enum attributes:
   for(let allowed_method in METHODS_ENUM){
      if(METHODS_ENUM.hasOwnProperty(allowed_method)){
         // *Returning true if the enum has the given method:
         if(METHODS_ENUM[allowed_method] === method) return true;
      }
   }

   // *Returning false, as the method is not supported:
   return false;
}



// *Exporting this module:
module.exports = { METHODS: METHODS_ENUM, isMethodSupported };
