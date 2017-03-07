/**
 * An array containing all the CORS headers used in preflight responses with CORS
 * @private
 * @readonly
 * @type {string[]}
 * @see {@link https://fetch.spec.whatwg.org/#http-responses}
 */
const PREFLIGHT_CORS_HEADERS = [
   'Access-Control-Allow-Origin',
   'Access-Control-Allow-Credentials',
   'Access-Control-Allow-Methods',
   'Access-Control-Allow-Headers',
   'Access-Control-Max-Age'
];



/**
 * An array containing all the CORS headers that may be used in actual responses with CORS
 * @private
 * @readonly
 * @type {string[]}
 * @see {@link https://fetch.spec.whatwg.org/#http-responses}
 */
const CORS_HEADERS = [
   'Access-Control-Allow-Origin',
   'Access-Control-Allow-Credentials',
   'Access-Control-Expose-Headers'
];



/**
 * Checks if a given header is one of the CORS headers used in preflight responses
 * @param  {string}  header_name The name of the header
 * @return {boolean}             Whether this header is one of the CORS headers
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS#Preflighted_requests} For more information about preflight requests in CORS
 */
function isPreflight(header_name){
   // *Getting the header name in lower case:
   header_name = header_name.toLowerCase();
   // *Checking if the header name matches, and returning:
   return PREFLIGHT_CORS_HEADERS.some(preflight_header => preflight_header.toLowerCase() === header_name);
}



/**
 * Checks if a given header may be used in responses other than the preflight ones
 * @param  {string}  header_name The name of the header
 * @return {boolean}             Whether this header may be used outside preflight responses
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS#Preflighted_requests} For more information about preflight requests in CORS
 */
function isNotOnlyPreflight(header_name){
   // *Getting the header name in lower case:
   header_name = header_name.toLowerCase();
   // *Checking if the header name matches, and returning:
   return CORS_HEADERS.some(cors_header => cors_header.toLowerCase() === header_name) || !isPreflight(header_name);
}



// *Exporting this module:
module.exports = { isPreflight, isNotOnlyPreflight };
