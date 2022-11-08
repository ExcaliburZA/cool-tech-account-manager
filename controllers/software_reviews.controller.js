const Division = require('../frontend/models/division_model');

exports.AddCreds = function(req, res) {
    let newUser = new Division({
        user: {
            username: req.params.username,
            password: req.params.password
        }
    });

    //How to post to cool-tech.software_reviews ?

}
//in frontend make a GetToken method that requests a JWT token from the backend where it is stored in sessionStorage 
//response = await fetch('backend route that performs res.send(token)')
//let json = await res.json();
//let token = json.token    then use this in the Authorization header as below

//no JWT auth check here, do it in the frontend
//in backend, extract token from headers (see task 34) to see if user has permission 

//when they log gen a JWT token using their details and role and assign it to sessionStorage,  ,then use it as a header like below
/*let response = await fetch('/update/'+username , {
    Authorization: "Bearer "+token, */
//let json = await response.json();
//console.log(json.message);

exports.UpdateCreds = function(req, res) {
    let curr_username = req.params.curr_username;
    let new_username = req.params.new_username;
    let new_password = req.params.new_password;

    //Division.updateOne({username: curr_username} , {$set: {}})
}

