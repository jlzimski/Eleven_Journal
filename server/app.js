require("dotenv").config();
const Express = require("express");  // requires use of express npm package. importing and accessing dependencies housed in package.json
const app = Express();  // Create instance of Express-running top-level Express() function exported by the Express module
const dbConnection = require("./db"); // create a db variable that imports the db file

app.use(require('./middleware/headers'));

const controllers = require("./controllers"); // import controllers as a bundle through the object that we just exported 
// in the index.js and store in a variable called controllers.

// // GET request is made at local host 3000/test 
// app.use('/test', (req, res) => {  // when we go to /test endpoint, it fires Express function res.send
//     res.send('This is a message from the test endpoint on the server!')  
        // res(short for response) handles packaging the response object. .send() method sends off the response.
// });

app.use(Express.json()); 
// this statement MUST go above any routes. Any routes above this statement will not be able to use the express.json() function.
// ***Express has functionality built into it that allows it to be able to process requests that come into our server. 
// In order to use the req.body middleware, we need to use a middleware function called express.json(). 
// Express needs to JSON-ify the request to be able to parse and interpret the body of data being sent through the request.

app.use("/journal", controllers.journalController);
app.use("/user", controllers.userController); // call upon use() method from the Express framework and create a route to access any 
// future functions in our usercontroller.js. '/user' is setting up the endpoint our URL will need to include to access a controller.
// app.use(require("./middleware/validate-jwt"));
// app.use("/journal/about", (req, res) => {
//     res.send('This is the about route!')
// });
// ****************************************

// app.listen(3000, () => {  // use express to start a UNIX socket and listen for connections on the given path
//     console.log(`[Server]: App is listening on 3000.`);  // callback function to see a message with the port that the server is running on
// });

dbConnection.authenticate() 
// use the db variable to access the sequelize instance and its methods from the db file. Call authenticate() method(method returns a promise)
    .then(() => dbConnection.sync()) // use promise resolver to access the returned promise and call upon the sync() method.
    .then(() => { 
    // use a promise resolver to access the returned promise from the sync() method and fire off the function that shows if we are connected
        app.listen(3000, () => {
            console.log(`[Server]: App is listening on 3000.`);
        });
    })
    .catch((err) => { // use promise rejection that fires off an error if there are any errors.
        console.log(`[Server]: Server crashed. Error = ${err}`);
    });
