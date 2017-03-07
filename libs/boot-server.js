/**
 * The server instance
 */
let server;

/**
 * A set of connection sockets
 * @type {Object}
 */
const sockets = {};



/**
 * Sets up and starts the Web Server
 * @param  {object} settings The settings to configure the server
 * @return {Promise}         The start task promise
 * @author Guilherme Reginaldo Ruella
 */
function start(settings){
   // *Checking if the settings wasn't set, and if didn't, rejecting the promise:
   if(!settings)
      return Promise.reject(new Error('Missing w-srvr settings'));

   // *Starting the web server:
   return startServer(settings)
      // *Handling exceptions:
      .catch(err => {
         // *If something went wrong:
         // *Stopping the service:
         return stop()
            // *Rejecting the promise chain:
            .then(() => Promise.reject(err));
      });
}



/**
 * Ends the Web Server gently
 * @return {Promise} The stopping promise
 * @author Guilherme Reginaldo Ruella
 */
function stop(){
   // *Stopping the web server:
   return stopServer();
}



/**
 * Starts the web server
 * @param  {object} settings The settings to configure the server
 * @return {Promise}         The server starting promise
 * @author Guilherme Reginaldo Ruella
 */
function startServer({ server_port, index_file, static_resources, api_resources }){
   // *Returning the starting promise:
   return new Promise((resolve, reject) => {
      // *Requiring the needed modules:
      const headers_util = require('./http-headers-util.js');
      const { PARSERS } = require('./parsers.js');
      const { METHODS } = require('./methods.js');
      const express = require('express');
      const body_parser = require('body-parser');
      const url = require('url');

      // *Preparing the Expressjs instance:
      const app = express();

      // *Trying to configure the server:
      try{

         // *Getting each dynamic resource:
         for(let { methods, route, middleware, advanced } of api_resources){

            // *Declaring the middlewares list:
            const middlewares = [];

            // *Checking if advanced settings were set:
            if(advanced){
               // *If it were:
               // *Getting the parsers:
               const parsers = advanced.parsers;
               // *Getting the headers:
               const headers = advanced.headers;

               // *Checking if there are parsers set:
               if(parsers.length){
                  // *If there are:
                  // *Getting each parser set:
                  parsers.forEach(({ type, options }) => {
                     // *Checking the parser type:
                     switch(type){
                     case PARSERS.JSON:
                        // *If it is a JSON parser:
                        // *Adding the parser:
                        middlewares.push(body_parser.json(options));
                        break;
                     case PARSERS.TEXT:
                        // *If it is a text parser:
                        // *Adding the parser:
                        middlewares.push(body_parser.text(options));
                        break;
                     case PARSERS.RAW:
                        // *If it is a raw parser:
                        // *Adding the parser:
                        middlewares.push(body_parser.raw(options));
                        break;
                     case PARSERS.URLENCODED:
                        // *If it is an urlencoded parser:
                        // *Adding the parser:
                        middlewares.push(body_parser.urlencoded(options));
                        break;
                     }

                  });

               }

               // *Checking if there are headers set:
               if(headers.length){
                  // *If there are:
                  // *Getting only the preflight headers:
                  const preflight_headers = headers.filter(h => headers_util.isPreflight(h.name));
                  // *Getting the headers that are not intended to be used just only in preflight responses:
                  const normal_headers = headers.filter(h => headers_util.isNotOnlyPreflight(h.name));

                  // *Checking if there are preflight headers set:
                  if(preflight_headers.length){
                     // *If there are:
                     // *Registering an OPTIONS middleware to handle preflight requests when using CORS:
                     app.options(route, (req, res, next) => {
                        // *Adding the preflight headers:
                        preflight_headers.forEach(({ name, value }) => res.header(name, value));
                        // *Setting thes response as successful:
                        res.status(200);
                        // *Sending to the next middleware:
                        next();
                     });

                  }

                  // *Adding the 'headers handling' middleware to the list:
                  middlewares.push(function(req, res, next){
                     // *Adding all the normal headers into the response:
                     normal_headers.forEach(({ name, value }) => res.header(name, value));
                     // *Sending to the next middleware:
                     next();
                  });

               }

            }

            // *Checking if the 'middleware' is actually an array:
            if(middleware){
               if(Array.isArray(middleware)){
                  // *If it is:
                  // *Adding its items individualy in the list:
                  middlewares.push(...middleware);
               } else{
                  // *If it isn't:
                  // *Adding it in the list:
                  middlewares.push(middleware);
               }
            }

            // *Getting each method:
            methods.forEach(method => {
               // *Checking the method type:
               switch(method){
               case METHODS.GET:
                  // *If it is GET:
                  // *Serving as GET:
                  app.get(route, middlewares);
                  break;
               case METHODS.POST:
                  // *If it is POST:
                  // *Serving as POST:
                  app.post(route, middlewares);
                  break;
               case METHODS.PUT:
                  // *If it is PUT:
                  // *Serving as PUT:
                  app.put(route, middlewares);
                  break;
               case METHODS.DELETE:
                  // *If it is DELETE:
                  // *Serving as DELETE:
                  app.delete(route, middlewares);
                  break;
               case METHODS.HEAD:
                  // *If it is HEAD:
                  // *Serving as HEAD:
                  app.head(route, middlewares);
                  break;
               case METHODS.PATCH:
                  // *If it is PATCH:
                  // *Serving as PATCH:
                  app.patch(route, middlewares);
                  break;
               case METHODS.OPTIONS:
                  // *If it is OPTIONS:
                  // *Serving as OPTIONS:
                  app.options(route, middlewares);
                  break;
               }
            });

         }


         // *Getting each static resource:
         for(let { route, path } of static_resources){
            // *Serving the static resource:
            app.use(route, express.static(path));
         }


         // *Checking if the index file is set:
         if(index_file){
            // *If it is:
            // *Serving the index file:
            app.use('/', (req, res, next) => {
               // *Sending the file:
               res.status(200)
                  .sendFile(index_file);
            });
         }


         // *Handling 404 errors:
         app.use((req, res, next) => {
            // *Checking if the status code has been set:
            if(res.statusCode){
               // *If it has:
               // *Ending the response:
               res.end();
            } else{
               // *Ending the response with a 'Resource not found' error:
               res.status(404).end();
            }
         });


         // *Setting up the server port:
         app.locals.port = server_port;
         // *Checking if the port could be set, and if it couldn't, throwing an error:
         if(!app.locals.port)
            throw new Error('The server port must be set');


         // *Starting up the server:
         server = app.listen(app.locals.port, () => {
            // *Starting the socket counter:
            let next_socket_id = 0;

            // *When a new socket connects:
            server.on('connection', socket => {
               // *Increasing the socket counter:
               let socket_id = next_socket_id++;
               // *Adding the socket into the socket set:
               sockets[socket_id] = socket;

               // *When the connection ends:
               socket.on('close', () => {
                  // *Removing the socket from the set:
                  delete sockets[socket_id];
               });
            });

            // *Getting the address information:
            let address = server.address();

            // *Resolving the promise:
            resolve({ server, address: url.parse(`http://${address.address==='::'?'localhost':address.address}:${address.port}/`) });
         }).on('error', err => {
            // *Rejecting the promise:
            reject(err);
         });

      } catch(err){
         // *If something went wrong:
         // *Rejecting the promise:
         reject(err);
      }
   });
}



/**
 * Stops the Web Server
 * @return {Promise} The stopping promise
 * @author Guilherme Reginaldo Ruella
 */
function stopServer(){
   // *Returning the stopping promise:
   return new Promise((resolve, reject) => {
      // *Checking if the server was not set, and if it wasn't, resolving the promise:
      if(!server) return resolve();

      // *When the server closes:
      server.close(err => {
         // *Resolving the promise:
         resolve();
      });

      // *Trying to finish all the connected sockets:
      try{
         // *Getting each socket connected:
         for(let socket_id in sockets){
            // *Finishing the socket connection:
            sockets[socket_id].destroy();
         }
      } catch(err){
         // *If something went wrong:
         // *Rejecting the promise:
         reject(err);
      }
   });
}



// *Exporting this module:
module.exports = { start, stop };
