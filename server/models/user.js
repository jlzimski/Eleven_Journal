const { DataTypes } = require("sequelize"); // Object destructuring is used to extrapolate the DataTypes object from the sequelize dependency
const db = require("../db"); // import the connection to our database that we set up in the db.js. 
// This will unlock methods from the sequelize connection that we can call upon.

// DEFINE AND CREATE THE MODEL call the .define() method that will map 
// model properties in the server file to a table in Postgres.
// We pass the first argument in the string user; This will become a table called users in Postgres(table names are pluralized).
const User = db.define("user", {
    email: { // create email object. key/value pairs become columns of the table 
        type: DataTypes.STRING(100), // define data type as string
        allowNull: false,
        unique: true, // this property means that all data must be unique and cannot have duplicates
    },
    password: { // create password object. key/value pairs become columns of the table
        type: DataTypes.STRING, // define data type as string
        allowNull: false,
    },
});

module.exports = User; // use CommonJS to export the User Model in order to access it in other files
// and allow Sequelize to create the users table with the email and password columns the next time the
// server connects to the database and a user makes a POST request that uses the model.


