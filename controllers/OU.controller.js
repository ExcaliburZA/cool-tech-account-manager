const OU = require('../frontend/src/models/OU_model');
const Users = require('../frontend/src/models/user_model');

/**
 * retrieves an organisational unit document from the database and sends back its information
 * @param req request object
 * @param res response object 
 */
exports.View_OU = async function(req, res){
    let username = req.params.username;
    let OU_name = req.params.OU_name;
    let OU_obj = {};
    let found = false;


    
    //searching for an organisational unit using its name
    OU.find({ou_name: {$eq: OU_name}})
    .then((ret) => {
        OU_obj = ret[0];

        //attempts to override OU permissions if the user is an admin, if not the username whitelist for the division is checked for the username in order to authenticate the user
        Users.findOne({username:  username , role: 'admin'}) 
        .then((result) => {
            if(result){
                //if the query returned something it means the user is an admin
                found = true;
                console.log("result: \n", result);
                console.log(username+" identified as admin!");
                
                //sending back the information that would otherwise be hidden from a normal or manager user
                res.send({divisions: OU_obj.divisions , message: "success" , ou_obj: OU_obj});       
                return;         
            } else {
                console.log("NOT admin user");
            }    
        }).then(() => {
            let x = 0;      
        
            //iteratively searches for the provided username in the list of allowed usernames for the organisational unit
            while((!found) && (x<OU_obj.allowedusers.length)) {
                if(OU_obj.allowedusers[x] === username){
                    //sending back the retrieved information for the selected organisational unit in the response and editing the loop control variabel to terminate it
                    found = true;                
                    res.send({divisions: OU_obj.divisions , message: "success" , ou_obj: OU_obj});                
                } else ++x;
            }
        })
        .then(() => {
            //displaying an appropriate message if the username is not found
            if(!found){            
                console.log("OU controller says: "+username+" NOT FOUND!");
                res.send({message: "failed"});
            } 
        });      

    });
}

/**
 * updates the information for an organisational unit
 * @param req request object
 * @param res result object
 */
exports.UpdateOU = async function(req, res){
    let ou_obj = req.body.ou_obj;

    //replacing the specified organisational unit document in the database with an object containing updated information
    let updateResponse = await OU.findOneAndReplace({ou_name: {$eq:ou_obj.ou_name}} , ou_obj );

    //sending back the response
    res.send({updated_response: updateResponse});
}

/**
 * updates the credentials for a specified account in a division repository
 * @param req request object
 * @param res response object
 */
exports.UpdateCreds = async function(req, res){
    let ou_obj = req.body.ou_obj;
    
    //replacing the specified organisational unit document in the database with an object containing updated information
    let updateResponse = await OU.findOneAndReplace({ou_name: {$eq:ou_obj.ou_name}} , ou_obj );
    
    //sending back the response
    res.send({updated_response: updateResponse});
}

