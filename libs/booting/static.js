// *Getting the needed dependencies:
const middlewares_util = require('../utils/middlewares');
const express = require('express');



/**
 * Mounts the static resource serving route into express
 * @param {object} app              The express server
 * @param {Array} static_resources  The static resources array
 */
function applyStaticResource(app, static_resources){
   // *Defining the static headers middleware:
   const static_middleware = (res, path, stat) => res.status(200);
   // *Getting each static resource:
   for(let { route, path, options } of static_resources){
      // *Serving the static resource:
      app.use(route, express.static(path, {
         setHeaders: static_middleware,
         redirect:   false,
         index:      false,
         dotfiles:   options.dotfiles,
         maxAge:     options.maxAge,
         etag:       options.etag
      }));
   }
}



/**
 * Mounts the index page serving into express
 * @param {object} app   The express server
 * @param {object} index The index page configuration object
 */
function applyIndexPage(app, index){
   // *Building the index page middleware:
   const index_middleware = (req, res, next) => {
      // *Sending the index file:
      res.status(200).sendFile(index.file);
   };

   // *Checking if the 'roots only' flag is true:
   if(index.options.root_only){
      // *If it is:
      // *Only sending the index poge on the root route:
      app.get('/', index_middleware);
   } else{
      // *If it's not:
      // *Sending the index page on all the available routes:
      app.get('/*', index_middleware);
   }
}



// *Exporting this module:
module.exports = {
   applyStaticResource,
   applyIndexPage
};
