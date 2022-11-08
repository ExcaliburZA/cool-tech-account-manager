const Users = require('../frontend/src/models/user_model');
const jwt = require('jsonwebtoken');

/**
 * registers a new user account
 * @param  req request object
 * @param  res result object
 */
exports.RegisterUser = async function(req, res) {
    //creating an object with the new user's information
    let newUser = {
        username : req.params.username,
        password: req.params.password,
        role: 'normal'
    };

    //outputting a message indicating username uniqueness
    let userExists = await Users.findOne( {username: {$eq: newUser.username}} )
    if(userExists) {
        console.log("Username is NOT UNIQUE");
    } else {               
        console.log("Username is UNIQUE");
    }

    //creating a new user account if the provided username is unique
    if(!userExists){
        Users.create( newUser )
        .then(result => {
            console.log("Registration result: ",result); 
            
            //generating a token for the registered user and sending it back in the response
            let token = GenToken(newUser.username , newUser.password, newUser.role);
            res.status(200).send({"token": token});
        });
    } else { //if username is not unique an appropriate message is displayed
        console.log("Controller: username exists!");
        res.status(500).send({"token": "NA"});
    } 
}

/**
 * attempts to authenticate a user using the provided credentials
 * @param req request object
 * @param res result object
 */
exports.LogIn = async function(req, res) {   
    Users.find({username: {$eq: req.params.username} , password: {$eq: req.params.password}})
    .then((ret) => {
        if(ret.length > 0){
            //generating a token for the logged in user and sending it back in the response
            let token = GenToken(ret[0].username , ret[0].password, ret[0].role);
            res.status(200).send({"token": token});
        } else res.status(500).send({"token": "NA"});

    })  
}

/**
 * deletes a user from the database using their username
 * @param req request object
 * @param res result object
 */
exports.DeleteUser = async function(req, res){
    let username = req.params.username;
    Users.deleteOne({username: {$eq: username}})
    .then((result) => {
        console.log("Users controller says: "+username+" deleted!");
        res.send({result: result});
    });
}

/**
 * generates a JWT token for the active user using the provided information
 * @param  username active account username
 * @param  password active account password
 * @param  role active account role
 * @returns 
 */
function GenToken(username, password, role) {
    let payload = {
        'username':username,
        'password':password,
        'role':role
    }

    //creating, signing, and returnign a JWT token for the active user
    const token = jwt.sign(JSON.stringify(payload) , 'jwt-secret' , {algorithm: 'HS256'});
    return token;
}

/**
 * updates the role of a user account
 * @param req request object
 * @param res result object
 */
exports.UpdateRole = async function(req, res){
    let username = req.params.username;
    let new_role = req.params.new_role;

    //searching for the user in the daatabase to ensure they exist before attempting to perform an update
    let userExists = await Users.findOne( {username: {$eq: username}} );
    if(userExists){
        //let updateResponse = await Users.findOneAndReplace({username: {$eq: username}} , {role: new_role});
        let updateResponse = await Users.updateOne({username:  username} , {$set: {role: new_role}});
        console.log("Update performed!\nNew role for ",username+": ",new_role);
        res.send({updated_response: updateResponse});
    } else {
        console.log("Cannot perform role update, ",username+" does not exist in the database!");
    }
}

/**
 * searches for a user account using a username
 * @param  req request object
 * @param  res result object
 */
exports.Search = function(req, res){
    let username = req.params.username;
    
    //searching for the user account in the database and sending back an appropriate response
    Users.find( {username: {$eq: username}})
    .then((ret) => {
        console.log("Found:\n",ret);
        res.send(ret);
    })
}

/**
 * retrieves all users
 * @param  req request object
 * @param  res result object
 */
exports.GetAll = function(req, res) {
    Users.find()
    .then(() => {
        console.log("All users retrieved");
    })
}
