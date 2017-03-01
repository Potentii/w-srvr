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
   if(!settings) return Promise.reject(new Error('Missing w-srvr boot settings'));

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
function startServer({server_port, spa_file, static_resources, api_resources}){
   // *Returning the starting promise:
   return new Promise((resolve, reject) => {
      // *Requiring the needed modules:
      const url = require('url');
      const methods_enum = require('./methods.js');
      // *Preparing the Expressjs instance:
      const express = require('express');
      const app = express();
      const body_parser = require('body-parser');

      // *Trying to configure the server:
      try{

         // *Enabling JSON parsing:
         app.use(body_parser.json({limit: '1mb'}));


         // *Setting the headers:
         app.use((req, res, next) => {
            // *Setting the origins allowed:
            res.header('Access-Control-Allow-Origin', '*');
            // *Setting the HTTP methods allowed:
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PUSH,DELETE,OPTIONS');
            // *Setting the headers allowed:
            res.header('Access-Control-Allow-Headers', 'Content-Type,Accept');
            // *Sending to the next middleware:
            next();
         });


         // *Enabling POST requests via Ajax:
         app.options('/*', (req, res, next) => {
            // *Responding with 'OK':
            res.status(200).end();
         });


         // *Getting each dynamic resource:
         for(let { method, route, middleware } of api_resources){            
            // *Checking the method type:
            switch(method){
            case methods_enum.GET:
               // *If it is GET:
               // *Serving as GET:
               app.get(route, middleware);
               break;
            case methods_enum.POST:
               // *If it is POST:
               // *Serving as POST:
               app.post(route, middleware);
               break;
            case methods_enum.PUT:
               // *If it is PUT:
               // *Serving as PUT:
               app.put(route, middleware);
               break;
            case methods_enum.DELETE:
               // *If it is DELETE:
               // *Serving as DELETE:
               app.delete(route, middleware);
               break;
            }
         }


         // *Getting each static resource:
         for(let { route, path } of static_resources){
            // *Serving the static resource:
            app.use(route, express.static(path));
         }


         // *Checking if the SPA file is set:
         if(spa_file){
            // *If it is:
            // *Serving the SPA:
            app.use('/', (req, res, next) => {
               // *Sending the file:
               res.status(200)
                  .sendFile(spa_file);
            });
         }


         // *Resolving 404 errors:
         app.use((req, res, next) => {
            // *Sending the error message:
            res.status(404)
               .send('Resource not found');
         });


         // *Setting up the server port:
         app.locals.port = server_port || process.env.PORT;
         // *Checking if the port could be set, and if it couldn't, throwing an error:
         if(!app.locals.port) throw new Error('The server port must be set');


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
            resolve({address: url.parse(`http://${address.address==='::'?'localhost':address.address}:${address.port}/`)});
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
