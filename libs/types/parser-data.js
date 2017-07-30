// *Getting the needed dependencies:
const body_parser = require('body-parser');
const { PARSERS } = require('../utils/parsers');



/**
 * Represents information about a parser configuration
 * @class
 */
module.exports = class ParserData {

   /**
    * Instantiates a new ParserData object
    * @constructor
    * @param {string} type      One of the supported parser types
    * @param {object} [options] The parser options object
    */
   constructor(type, options) {
      // *Setting the instance properties:
      this._type = type;
      this._options = options;
   }



   /**
    * Retrieves the body-parser middleware for this parser data
    * @return {function} The parser middleware
    */
   buildMiddleware(){
      // *Checking the parser type:
      switch(this._type){
      case PARSERS.JSON:
         // *If it is a JSON parser:
         // *Adding the parser:
         return body_parser.json(this._options);
         break;
      case PARSERS.TEXT:
         // *If it is a text parser:
         // *Adding the parser:
         return body_parser.text(this._options);
         break;
      case PARSERS.RAW:
         // *If it is a raw parser:
         // *Adding the parser:
         return body_parser.raw(this._options);
         break;
      case PARSERS.URLENCODED:
         // *If it is an urlencoded parser:
         // *Adding the parser:
         return body_parser.urlencoded(this._options);
         break;
      }
   }
}
