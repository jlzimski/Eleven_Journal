const Sequelize = require('sequelize'); 
// import sequelize package and create an instance of sequelize for use in the module with the Sequelize variable

const sequelize = new Sequelize("postgres://postgres:endor1979@localhost:5432/eleven-journal"); // create new sequelize object
// postgres(1)-identifies the database table to connect to. postgres(2)-the username to connect to the database. 
// endor1979-password used for local database(pgAdmin). localhost:5432-local port for Sequelize. eleven-journal-name of specific database.
module.exports = sequelize; // export the module
