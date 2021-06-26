module.exports = {  // we are exporting this file as a module(an object)
    userController: require('./userController'),
    journalController: require("./journalcontroller"), 
    // define a property called journalController with a value of the import of the journalcontroller file.
};