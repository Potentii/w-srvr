


/**
 * Supported body parsers
 * @readonly
 * @enum {string}
 */
const PARSERS = {
   get JSON(){
      return 'json';
   },
   get TEXT(){
      return 'text';
   },
   get RAW(){
      return 'raw';
   },
   get URLENCODED(){
      return 'urlencoded';
   }
};



// *Exporting this module:
module.exports = { PARSERS };
