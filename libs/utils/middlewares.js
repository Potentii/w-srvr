


/**
 * Builds a middleware that sets the headers of the response
 * @param  {Array} headers An array of { name, value } objects
 * @return {function}      The middleware function
 */
function headersMiddleware(headers){
   // *Returning the headers middleware:
   return function(req, res, next){
      // *Getting each header data:
      for(let header of headers){
         // *Adding the header into the response:
         res.set(header.name, header.value);
      }
      // *Sending to the next middleware:
      next();
   };
}



/**
 * Builds a middleware that sets the status of the response
 * @param  {number} status The new status of the response
 * @return {function}      The middleware function
 */
function statusMiddleware(status){
   // *Returning the status middleware:
   return function(req, res, next){
      // *Setting the response status:
      res.status(status);
      // *Sending to the next middleware:
      next();
   };
}



// *Exporting this module:
module.exports = {
   headersMiddleware,
   statusMiddleware
};
