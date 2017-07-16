/**
 * The server instance
 */
let server = null;

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
function startServer({ server_port, secure, not_found_middlewares, index, static_resources, api_resources, ee }){
   // *Returning the starting promise:
   return new Promise((resolve, reject) => {
      // *Requiring the needed modules:
      const { HOOKS } = require('./utils/hooks');
      const express = require('express');
      const url = require('url');
      const booting = {
         api: require('./booting/api'),
         static: require('./booting/static')
      };

      // *Preparing the Expressjs instance:
      const app = express();


      // *Emitting the 'before setup' event:
      ee.emit(HOOKS.BEFORE_SETUP, app, express);


      // *Trying to configure the server:
      try{

         // *Defining the prefixed middleware:
         app.use((req, res, next) => {
            // *Setting the default status code to 404:
            res.status(404);
            // *Sending to the next middleware:
            next();
         });


         // *Emitting the 'before api setup' event:
         ee.emit(HOOKS.BEFORE_API_SETUP, app, express);


         // *Getting each API resource:
         for(let i=0; i<api_resources.length; i++){
            // *Building the preflight resource for this resource (only if it needed):
            let preflight = booting.api.getPreflightResource(api_resources[i]);
            // *Checking if the preflight was needed:
            if(preflight){
               // *If it was:
               // *Adding it to the middlewares (before the current one):
               api_resources.splice(i, 0, preflight);
               i++;
            }
         }


         // *Getting each API resource:
         for(let api_resource of api_resources){
            // *Adding the parsers middlewares:
            booting.api.addParsingFlow(api_resource);
            // *Adding the headers middlewares:
            booting.api.addHeadersFlow(api_resource);

            // *Getting each method of this resource:
            for(let method of api_resource.methods){
               // *Applying the resource into express:
               app[method.toLowerCase()](api_resource.route, ...api_resource.middlewares);
            }
         }


         // *Emitting the 'after api setup' event:
         ee.emit(HOOKS.AFTER_API_SETUP, app, express);


         // *Emitting the 'before static setup' event:
         ee.emit(HOOKS.BEFORE_STATIC_SETUP, app, express);


         // *Checking if there is any static resources set:
         if(static_resources.length){
            // *If there is:
            // *Serving the static resources (i.e. files):
            booting.static.applyStaticResource(app, static_resources);
         }

         // *Checking if the index file is set:
         if(index && index.file){
            // *If it is:
            // *Serving the index page:
            booting.static.applyIndexPage(app, index);
         }


         // *Emitting the 'after static setup' event:
         ee.emit(HOOKS.AFTER_STATIC_SETUP, app, express);


         // *Handling hanging responses:
         app.use((req, res, next) => {
            // *Checking if the status code is different than 404:
            if(res.statusCode != 404){
               // *If it is:
               // *Ending the response:
               res.end();
            } else{
               // *If it's not:
               // *Sending to the 404 middlewares:
               next();
            }
         });

         // *Getting each 'not found' middleware:
         for(let not_found_middleware of not_found_middlewares){
            // *Using it:
            app.use(not_found_middleware);
         }

         // *Ending hanging responses (as the custom 404 middleware could left them hanging):
         app.use((req, res, next) => res.end());


         // *Setting up the server port:
         app.locals.port = server_port;
         // *Checking if the port could be set, and if it couldn't, throwing an error:
         if(!app.locals.port)
            throw new Error('The server port must be set');


         // *Emitting the 'after setup' event:
         ee.emit(HOOKS.AFTER_SETUP, app, express);


         // *Checking if the secure options were set:
         if(secure)
            // *If they were:
            // *Starting up the server using HTTPS:
            server = require('https').createServer(secure, app);
         else
            // *If they weren't:
            // *Starting up the server using HTTP:
            server = require('http').createServer(app);

         // *Starting the server:
         server.listen(app.locals.port, () => {
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
            resolve({ server, address: url.parse(`http${secure?'s':''}://${address.address==='::'?'localhost':address.address}:${address.port}/`) });
         })
         .on('error', err => {
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
         server = null;
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
