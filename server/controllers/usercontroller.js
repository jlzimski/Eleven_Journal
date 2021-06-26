const router = require("express").Router(); // Import the Express framework and access the Router() method assigning it to a variable called router
const { UserModel } = require("../models"); // use object deconstructing to import the user model and store it in UserModel variable.
const { UniqueConstraintError } = require("sequelize/lib/errors"); // for error handling and to check for email already in use.
const jwt = require("jsonwebtoken"); // import json package for assigning tokens for authentication
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => { // use router object by using router variable to get access to the 
// Router() object methods post() is one of the methods in the object and we call it here. The first argument /register is the path. 
// The second argument is an async callback function(handler function)
    let { email, password } = req.body.user; // use object deconstruction to take in and parse the request. 
    // use req.body middleware provided by Express and append two properties
    // or key/value pairs to it. req-actual request body-where data is being held user is property of body; 
    // email and password are properties of user.
    try {
        const User = await UserModel.create( { // use the UserModel variable created on line 2 to access the model(users.js). this gives access to the  
        // UserModel model properties and Sequelize methods.
            email, // send the data from our create() method. Left-hand side of this object has to match our User model.
            password: bcrypt.hashSync(password, 13),
        });
        let token = jwt.sign( {id: User.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});
        res.status(201).json( {
            message: "User successfully registered",
            user: User,
            sessionToken: token
        });
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json( {
                message: "Email already in use",
            });
        } else {
        res.status(500).json( {
            message: "Failed to register user",
        });
        }
    }
});

router.post("/login", async (req, res) => {
    let { email, password } = req.body.user;

    try {
        const loginUser = await UserModel.findOne( {
            where: {
                email: email,
            },
        });

        if (loginUser) {
            let passwordComparison = await bcrypt.compare(password, loginUser.password);

            if (passwordComparison){
                let token = jwt.sign( {id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});
                res.status(200).json( {
                    user: loginUser,
                    message: "User successfully logged in!",
                    sessionToken: token
                });
            } else {
                res.status(401).json( {
                    message: "Incorrect email or password"
                });
            }
        } else {
            res.status(401).json( {
                message: "Incorrect email or password"
            });
        }
    } catch (error) {
        res.status(500).json( {
            message: "Failed to log user in"
        })
    }
});

module.exports = router; // export the module 
//     try {
//     const User = await UserModel.create( { // use the UserModel variable created on line 2 to access the model(users.js). 
//     // this gives access to the  UserModel model properties and Sequelize methods.
//     // in order to call the data so it can be used or displayed we assign it to a variable named User.
//         email,
//         password
//     });
//     let token = jwt.sign({ id: User.id }, "i_am_secret", { expiresIn: 60 * 60 * 24 });
//     // create variable token, call jwt variable, .sign() is method used to create token(includes 2 parameters payload and signature)
//     // 1st parameter is payload. User.id is primary key of the user table User refers to the variable which captures the promise
//     // 2nd parameter is signature. "i_am_secret" token set to expire in (seconds * minutes * hours) in this case 1 day
// //     res.send("This is our user/register endpoint!"); // after the await is complete and user is created, 
// // then a message is returned indicating success.
// // });
//         res.status(201).json( { // .status() allows us to add a status code to a response. .json() packages the response as a json
//             message: "User successfully registered",
//             user: User, // the data that was added to the database and stored in the User variable is now being sent to the client and 
//             // stored in a user property. user is the key, User is the value.
//             sessionToken: token // add key of sessionToken and pass value of the token. Server has now assigned a token to a specific user/client
//         });
//     } catch (err) { // if the code fails it will throw an exception
//         if (err instanceof UniqueConstraintError) {
//             res.status(409).json( {
//                 message: "Email already in use",
//             });
//         } else {
//         res.status(500).json( {
//             message: "Failed to register user",
//         });
//         }
//     }
// });

// router.post("/login", async (req, res) => { // use the Express router object and call the post() method. post() method accepts 
//     // two arguments:/login is the path, second is callback function that allows us access to the request and response.
//     let { email, password } = req.body.user; // use object deconstruction to pull the email and password from the request
//     try {
//     const loginUser = await UserModel.findOne( { 
//         // findOne() method is a Sequelize method that tries to find one element from the matching model within the database
//         where: { // where is an object in Sequelize that tells the database to look for something 
//             email: email, // 
//         },
//     });
//     if (loginUser) {
//     res.status(200).json( {
//         user: loginUser,
//         message: "User successfully logged in!"
//     });
//     } else {
//         res.status(401).json( {
//             message: "Login failed"
//         });
//     }
//     } catch (error) {
//         res.status(500).json( {
//             message: "Failed to log user in"
//         })
//     }
// });

