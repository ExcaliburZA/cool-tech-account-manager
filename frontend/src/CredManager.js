import React from "react";
import './App.css';

export default class CredManager extends React.Component{
    active_username = "";
    active_password = "";
    active_role = "";

    new_username = "";
    new_password = "";
    new_account_name = "";

    target_username = "";
    update_target_username = "";

    updatedUsername = "";
    updatedPassword = "";
    updatedAccName = "";

    /**
     * component constructor
     * @param {*} props 
     */
    constructor(props){
        super(props);

        //initializing state
        this.state = {username: "" , 
        password: "" , role: "" , 
        token: {},
        news_management: false , 
        software_reviews :false , 
        hardware_reviews: false , 
        opinion_publishing: false , 
        OU: "" , 
        division: "" ,
        divisions: [],
        creds: [] ,
        ou_obj: {},
        };

        //method binding
        this.LogIn = this.LogIn.bind(this);
        this.Register = this.Register.bind(this);
        this.SelectOU = this.SelectOU.bind(this);
        this.SelectDiv = this.SelectDiv.bind(this);
        this.UpdateUsername = this.UpdateUsername.bind(this);
        this.UpdatePassword = this.UpdatePassword.bind(this);
        this.OU_Display = this.OU_Display.bind(this);
        this.DivDisplay = this.DivDisplay.bind(this);
        this.LoginComps = this.LoginComps.bind(this);
        this.CreditSet = this.CreditSet.bind(this);
        this.AddCreds = this.AddCreds.bind(this);
        this.ButtonControls = this.ButtonControls.bind(this);

        this.GetNewUsername = this.GetNewUsername.bind(this);
        this.GetNewUsername = this.GetNewUsername.bind(this);
        this.GetNewAccountName = this.GetNewAccountName.bind(this);
        this.GetUpdatedCreds = this.UpdateCreds.bind(this);
        this.UpdateCreds = this.UpdateCreds.bind(this);
        this.GetTargetUsername = this.GetTargetUsername.bind(this);
        this.GetUpdateTargetUsername = this.GetUpdateTargetUsername.bind(this);
       
        this.AddToDiv = this.AddToDiv.bind(this);
        this.RemoveFromDiv = this.RemoveFromDiv.bind(this);
        this.AddToOU = this.AddToOU.bind(this);
        this.RemoveFromOU = this.RemoveFromOU.bind(this);
        this.Return = this.Return.bind(this);
    }
    
    /**
     * component render method that renders an output to the DOM
     * @returns 
     */
    render(){
        if(this.state.username.length <= 0){ //if user is not yet logged in
            
            return(
                <div>
                    <h1>Welcome to the Cool Tech credentials manager!</h1><br/>
                    <this.LoginComps />
                </div>
            )
        } else if (this.state.OU === "") { //if user is logged in but has not selected an OU
            
            return(
                <div>
                    <h1>Please select an organizational unit to continue</h1><br/>
                    <this.OU_Display />
                </div>
            )

        } else if (this.state.division === "") { //if logged in user has selected an OU but not a division
            
            return(
                <div>
                    <h1>Please select a divison to continue</h1><br/>
                    <this.DivDisplay />
                </div>
            )

        } else {          
            let creds = this.state.creds;     
            return(
                <div>
                    <h1>Credentials for {this.state.division}</h1><br />
                        
                    {/*mapping each set of credentials to a CreditSet component */}
                    {creds.map(credset => (
                            <this.CreditSet key={Math.random()} credentials={credset}/>
                        ))}
                    <br />
                    <this.ButtonControls />

                </div>
            )
        }
    }

    /**
     * adds a user to the selected division using their username
     */
    async AddToDiv(){
        let updatedOU = this.state.ou_obj;

        let division_index = 0;
        let found = false;

        //searching for the specified division
        while((!found) && (division_index < updatedOU.divisions.length)){
            if(this.state.divisions[division_index].name === this.state.division){
                found = true;

            } else {
                ++division_index;
            }
        }

        //updating the division with the new credentials if it is found
        if(found){
            let updatedDiv = this.state.divisions[division_index];
            console.log("Updating "+updatedDiv.name+"...");

            //adding new credentials object to credentials array of the division
            updatedDiv.allowedusers.push(this.target_username); 
            updatedOU.divisions[division_index] = updatedDiv;

            //making a call to the back-end with the updated organisational unit object being passed in the body
           await fetch('/new/'+this.state.OU , {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ou_obj:updatedOU}),

            }).then(() => {
                alert("Allowed users for "+this.state.division+" updated!\nRecently added user: "+updatedDiv.allowedusers[updatedDiv.allowedusers.length-1]);
            })
            
        }
    }

    /**
     * removes a user from the selected division using their username
     */
    async RemoveFromDiv(){
        let updatedOU = this.state.ou_obj;

        let division_index = 0;
        let found = false;

        //searching for the division
        while((!found) && (division_index < updatedOU.divisions.length)){
            if(this.state.divisions[division_index].name === this.state.division){
                found = true;
            } else {
                ++division_index;
            }
        }

        //removing the username from the division's allowed users list if the division is found
        if(found){
            let updatedDiv = this.state.divisions[division_index];
            console.log("Updating "+updatedDiv.name+"...");

            //checking if the username appears in the list of allowed usernames of the division before removing it
            let name_index = updatedDiv.allowedusers.indexOf(this.target_username);
            if(name_index > -1){
                updatedDiv.allowedusers.splice(name_index, 1);
            }
            
            updatedOU.divisions[division_index] = updatedDiv;

            //making a call to the back-end with the updated organisational unit object being passed in the body
           await fetch('/new/'+this.state.OU , {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ou_obj:updatedOU}),

            }).then(() => {
                alert("Allowed users for "+this.state.division+" updated!\nNew number of users: "+updatedDiv.allowedusers.length);               
            })
            
        }
    }

    /**
     * adds a user to an organisational unit using their username
     */
    async AddToOU(){
        let updatedOU = this.state.ou_obj;

        //updating the organisational unit object with the new username if it does not already appear there 
        if(!updatedOU.allowedusers.includes(this.target_username)){
            updatedOU.allowedusers.push(this.target_username);

            //making a call to the back-end with the updated organisational unit object being passed in the body
            await fetch('/new/'+this.state.OU, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ou_obj:updatedOU}),
            }).then(() => {
                alert("Added "+this.target_username+" to "+this.state.OU);
            })          

        } else {
            alert(this.target_username+" already exists in "+this.state.division);
        }
    }

    /**
     * removes a user from an organisational unit using their username
     */
    async RemoveFromOU(){
        let updatedOU = this.state.ou_obj;

        //checking if the provided username appears in the allowed users list for the organisational unit and removing it if it does
        if(updatedOU.allowedusers.includes(this.target_username)){
            let name_index = updatedOU.allowedusers.indexOf(this.target_username);
            updatedOU.allowedusers.splice(name_index, 1);

            //making a call to the back-end with the updated organisational unit object being passed in the body
            await fetch('/new/'+this.state.OU, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ou_obj:updatedOU}),
            }).then(() => {
                alert("Removed "+this.target_username+" from "+this.state.OU);
            })          

        } else {
            alert(this.target_username+" does not exist in "+this.state.OU);
        }
    }

    /**
     * deletes a user account from the database
     */
    async DeleteUser(){
        await fetch('/delete/'+this.target_username , {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(() => {
            alert(this.target_username+" deleted!");
        })
    }


    /**
     * returns HTML input and button components based on the active user's role
     * @returns HTML components
     */
    ButtonControls(){        
        switch(this.state.role){
            case "admin":
                return(
                    <div>
                        <input onChange={this.GetNewUsername} placeholder="New username"/><br/>
                        <input onChange={this.GetNewPassword} placeholder="New password"/><br/>
                        <input onChange={this.GetNewAccountName} placeholder="New account name"/><br/>
                        <button className="edit-button" onClick={() => this.AddCreds()}>Add credentials to repo</button><br/><br/><br/>
                        
                        <label htmlFor="in_update">Enter the username of the account you wish to update the credentials for</label><br/>
                        <input id="in_update" onChange={this.GetUpdateTargetUsername} /><br/>
                        <button className="edit-button" onClick={() => this.UpdateCreds()}>Update credentials in repository</button><br/><br/><br/>
                        

                        <label htmlFor="in_add_remove">Enter the username of the user you wish to edit the permissions for</label><br/>
                        <input id="in_add_remove" onChange={this.GetTargetUsername}/><br/>
                        <button className="edit-button" onClick={() => this.UpdateRole()}>Update role</button>
                        <button className="edit-button" onClick={() => this.DeleteUser()}>Delete user</button> <br/>
                        <button className="edit-button" onClick={() => this.AddToDiv()}>Add to {this.state.division}</button>
                        <button className="edit-button" onClick={() => this.RemoveFromDiv()}>Remove from {this.state.division}</button><br/>
                        <button className="edit-button" onClick={() => this.AddToOU()}>Add to {this.state.OU}</button>
                        <button className="edit-button" onClick={() => this.RemoveFromOU()}>Remove from {this.state.OU}</button><br/>                                     

                        <button className="edit-button"  onClick={() => this.Return()} >Return to organisational unit selection</button>
                        <h3>Current access level: admin</h3>
                    </div>
                );                
            case "manager":
                return(
                    <div>
                        <input onChange={this.GetNewUsername} placeholder="New user username"/><br/>
                        <input onChange={this.GetNewPassword} placeholder="New user password"/><br/>
                        <input onChange={this.GetNewAccountName} placeholder="New account name"/><br/>
                        <button className="edit-button" onClick={() => this.AddCreds()}>Add credentials to repo</button><br/><br/><br/>

                        <label htmlFor="in_update">Enter the username of the account you wish to update the credentials for</label><br/>
                        <input id="in_update" onChange={this.GetUpdateTargetUsername} /><br/>
                        <button className="edit-button" onClick={() => this.UpdateCreds()}>Update credentials</button><br/>             

                        <button className="edit-button"  onClick={() => this.Return()} >Return to organisational unit selection</button>
                        <h3>Current access level: manager</h3>
                    </div>
                );               
            case "normal":
                return(
                    <div>
                        <input onChange={this.GetNewUsername} placeholder="New user username"/><br/>
                        <input onChange={this.GetNewPassword} placeholder="New user password"/><br/>
                        <input onChange={this.GetNewAccountName} placeholder="New account name"/><br/>
                        <button className="edit-button" onClick={() => this.AddCreds()}>Add credentials to repo</button><br/>

                        <button className="edit-button"  onClick={() => this.Return()} >Return to organisational unit selection</button>
                        <h3>Current access level: regular user</h3>
                    </div>
                );
        }
    }

    /**
     * returns the user to the organisational unit selection page
     */
    Return(){
        this.setState({OU: "", division: ""} , alert("Selection reset!\nOU: "+this.state.OU+"\nDivision: "+this.state.division));
    }


    /**
     * adds a new account to the credential repository of the currently selected division
     */
    async AddCreds(){
        let updatedOU = this.state.ou_obj;

        let division_index = 0;
        let found = false;

        //searching for the division
        while((!found) && (division_index < updatedOU.divisions.length)){
            if(this.state.divisions[division_index].name === this.state.division){
                found = true;
            } else {
                ++division_index;
            }
        }

        //updating the organisational unit object with the new user object if the division was found 
        if(found){
            let updatedDiv = this.state.divisions[division_index];
            console.log("Updating "+updatedDiv.name+"...");

            //adding new credentials object to creds array of div
            updatedDiv.creds.push({username: this.new_username , password: this.new_password , name: this.new_account_name}); 
            updatedOU.divisions[division_index] = updatedDiv;
           
            //making a call to the back-end with the updated organisational unit object being passed in the body
           await fetch('/new/'+this.state.OU , {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ou_obj:updatedOU}),

            }).then(() => {
                this.setState({creds: updatedDiv.creds} , console.log("Credentials list updated"));
            })
            
        }
    }

    /**
     * updates a user's role using their username
     */
    async UpdateRole(){

        const roles = ["normal","manager","admin"];

        //continuously prompts the user for a new role until they enter one that is one of the provided options
        let new_role = prompt("Please enter a new role for this user from the options below\n(normal, manager, admin)").toLowerCase();
        while(!roles.includes(new_role)){
            new_role = prompt("Invalid role!\n\nPlease enter a new role for this user from the options below\n(normal, manager, admin)");
        }

        //making a call to the back-end where the specified user's role will be updated
        let updateRes = await fetch("/role-update/"+this.target_username+"/"+new_role , {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },            
        })

        //parsing the update operation response as JSON and displaying an appropriate message
        let json = await updateRes.json();
        alert("User accounts updated: "+json.updated_response);
    }

    /**
     * onChange listener method that gets a value for the new account's username
     * @param event event object that represents the onChange event 
     */
    GetNewUsername = (event) => {
        this.new_username = event.target.value;
        console.log("New username: ",this.new_username);
    }

    /**
     * onChange listener method that gets a value for the new account's password
     * @param event event object that represents the onChange event 
     */
    GetNewPassword = (event) => {
        this.new_password = event.target.value;
        console.log("New password: ",this.new_password);
    }

    /**
     * onChange listener method that gets a value for the new account's account type
     * @param event event object that represents the onChange event 
     */
    GetNewAccountName = (event) => {
        this.new_account_name = event.target.value;
        console.log("New account name: ",this.new_account_name);
    }

    /**
     * updates an account in the credential repository of the currently selected division
     */
    async UpdateCreds(){
        this.updatedUsername = prompt("Enter the updated username");
        this.updatedPassword = prompt("Enter the updated password");
        this.updatedAccName = prompt("Enter the updated account name");     

        let updatedOU = this.state.ou_obj;

        let division_index = 0;
        let found = false;
        
        //continuously searching for the division
        while((!found) && (division_index < updatedOU.divisions.length)){
            if(this.state.divisions[division_index].name === this.state.division){
                found = true;

            } else {
                ++division_index;
            }
        }

        //updating the division of the organisational unit object with the new user object if the division was found
        if(found){
            let updatedDiv = this.state.divisions[division_index];
            console.log("Updating "+updatedDiv.name+"...");
            
            let target_index = 0;
            let found = false;

            //searching the division's credentials list for the account with the username that matches the one provided
            while((!found) && (target_index < updatedDiv.creds.length)){
                if(updatedDiv.creds[target_index].username === this.update_target_username){
                    //updating the organisational unit object with the new information before updating the loop control variable to terminate it
                    found = true;
                    updatedDiv.creds[target_index] = {username: this.updatedUsername , password: this.updatedPassword , name: this.updatedAccName};
                    console.log("Updated username for creds["+target_index+"] = ",updatedDiv.creds[target_index].username);
                } else{
                    ++target_index;
                }
            }

            //updating the division in the organisational unit object
            updatedOU.divisions[division_index] = updatedDiv;

             //making a call to the back-end with the updated organisational unit object being passed in the body
            await fetch('/update/'+this.state.OU , {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ou_obj: updatedOU})               
            })
            .then(() => {
                //updating the component state with the updated credentials
                this.setState({creds: updatedDiv.creds} , console.log("Credentials list updated"));
            })
        }
    }

    /**
     * gets the username that will be used for permission
     * @param event event object that represents the onChange event 
     */
    GetTargetUsername = (event) => {
        this.target_username = event.target.value;
        console.log("Targetting "+this.target_username);
    }

    /**
     * gets the username of the account that will be used for credential updates
     * @param event event object that represents the onChange event 
     */
    GetUpdateTargetUsername = (event) => {
        this.update_target_username = event.target.value;
        console.log("Targetting "+this.update_target_username+" for update");
    }

    /**
     * component that displays an account's information
     * @param props account information of the account being displayed
     * @returns HTML output representing the account information
     */
    CreditSet(props){
        let credentials = props.credentials;
        let username = credentials.username;
        let password = credentials.password;
        let account_name = credentials.name;

        //returning an unordered list containing the provided account's information
        return(
            <div>
                <ul>
                    <li>USERNAME: {username}</li>
                    <li>PASSWORD: {password}</li>
                    <li>ACCOUNT NAME: {account_name}</li>
                </ul><br/><br/>
            </div>

        );
    }

    /**
     * attempts to log a user in
     */
    async LogIn(){
        //authorises user and returns a JWT token for them containing their info and perms
        let response = await fetch('/login/'+this.active_username+'/'+this.active_password, {
            method: "POST"
        });

        //parsing the response as JSON
        let json = await response.json();

        //checking if the login attempt was successful before attempting to decode the user's JWT token
        if(json.token !== "NA"){           
        let user_token = json.token;
        let token_str = "Bearer "+user_token;

        //making a call to the back-end where the JWT token can be decoded and returned
        let secondResponse = await fetch('/decode' , {
            method: "GET",
            headers: new Headers({
                Authorization : token_str
            })           
        });

        json = await secondResponse.json();
        let decoded_token = json.token;       
        
        //message informing the user they have logged in
        alert(decoded_token.username +" logged in!");

        //updating component state with the active user's information
        this.setState( {
            username: decoded_token.username , 
            password: decoded_token.password , 
            role: decoded_token.role,
            token: user_token 
        } , 
            console.log("Active user: "+decoded_token.username+"\nRole: "+decoded_token.role));        
        } else 
            alert("User not found!");
    }
   
    /**
     * registers a new user account
     */
    async Register(){
        //makes a call to the back-end where the new account is registered
        let response = await fetch('/register/'+this.active_username+'/'+this.active_password, {
            method: "POST"
        });

        let json = await response.json();       
        
        //if operation was successful decoding the active user's JWT token
        if(json.token !== "NA"){
            let user_token = json.token;
            let token_str = "Bearer "+user_token;           

            //decoding the JWT token in the back-end
            let secondResponse = await fetch('/decode' , {
                method: "GET",
                headers: new Headers({
                    Authorization : token_str
                })           
            });
    
            //parsing the response as JSON
            json = await secondResponse.json();
            let decoded_token = json.token;

            //checking if the decoded token contains a username before saving the active user's information to state 
            if(decoded_token.username.length > 0){
                alert(decoded_token.username+ " registered!");

                this.setState( {
                    username: decoded_token.username , 
                    password: decoded_token.password , 
                    role: decoded_token.role,
                    token: user_token 
                } , 
                    console.log("New user username: "+decoded_token.username) );
            }
        } else {
            alert("Failed to register!");
        }
    }

    /**
     * retrieves information for the specified organisational unit
     * @param ou_name name of the organisational unit being selected
     */
    async SelectOU(ou_name){        
        let verified = false;
        let token_str = "";

        //checking the OU name in a switch case
        switch(ou_name){
            case "News management":

            //decoding the JWT token of the user
                token_str = "Bearer "+this.state.token;
                fetch('/decode' ,{
                    method: "GET",
                    headers: new Headers({
                        Authorization: token_str
                    })
                }) //parsing the response as json
                .then((ret) => { 
                    ret.json().then((val) => {
                        if(val.token.username.length > 0){ //if the username stored in the response token is not empty
                            //updating the verified boolean variable to indicate that the token has been verified
                            verified = true;
                            alert("Token verified for "+val.token.username);
                        } else{
                            alert("Token NOT verified (no username found in decoded token)");
                        } 
                    })
                    .then(async () => {
                        //fetching the organisational unit from the back-end if token verification was successful
                        if(verified){ 
                            let response = await fetch('/OU/news_management/'+this.state.username , {
                                method: "GET"
                            })

                            let json = await response.json();

                            //checking the status of the returned response object
                            if(json.message === "success"){
                                //updating component state with the retrieved organisational unit's information
                                this.setState( {OU: "news_management" , divisions: json.divisions , ou_obj: json.ou_obj} , () => {
                                    alert(this.state.username+" authenticated for "+this.state.OU+"\nRedirecting..."); 
                                });
                            } else {
                                alert(this.state.username+" does not belong to 'news management' and cannot view it");
                            } 

                        } else {
                            console.log("Token verification failed!");
                        }
                        
                    });

                })

                break;
            case "Software reviews":
                token_str = "Bearer "+this.state.token;
                fetch('/decode' ,{
                    method: "GET",
                    headers: new Headers({
                        Authorization: token_str
                    })
                })
                .then((ret) => {                
                    ret.json().then((val) => {
                        if(val.token.username.length > 0){ //if the username stored in the response token is not empty
                            verified = true;
                            alert("Token verified for "+val.token.username);
                        } else{
                            alert("Token NOT verified (no username found in decoded token)");
                        } 
                    })
                    .then(async () => {
                        if(verified){ 
                            let response = await fetch('/OU/software_reviews/'+this.state.username , {
                                method: "GET"
                            })

                            let json = await response.json();

                            if(json.message === "success"){
                                this.setState( {OU: "software_reviews" , divisions: json.divisions , ou_obj: json.ou_obj} , () => {
                                    alert(this.state.username+" authenticated for "+this.state.OU+"\nRedirecting...");  
                                });
                            } else {
                                alert(this.state.username+" does not belong to 'software reviews' and cannot view it");
                            } 

                        } else {
                            console.log("Token verification failed!");
                        }
                        
                    });

                })
                break;
            case "Hardware reviews":
                token_str = "Bearer "+this.state.token;
                fetch('/decode' ,{
                    method: "GET",
                    headers: new Headers({
                        Authorization: token_str
                    })
                })
                .then((ret) => {                    
                    
                    ret.json().then((val) => {
                        
                        if(val.token.username.length > 0){ //if the username stored in the response token is not empty
                            verified = true;
                            alert("Token verified for "+val.token.username);
                        } else{
                            alert("Token NOT verified (no username found in decoded token)");
                            
                        } 
                    })
                    .then(async () => {
                        if(verified){ 
                            
                            let response = await fetch('/OU/hardware_reviews/'+this.state.username , {
                                method: "GET"
                            })

                            let json = await response.json();

                            if(json.message === "success"){
                                this.setState( {OU: "hardware_reviews" , divisions: json.divisions , ou_obj: json.ou_obj} , () => {
                                    alert(this.state.username+" authenticated for "+this.state.OU+"\nRedirecting..."); 
                                });
                            } else {
                                alert(this.state.username+" does not belong to 'hardware reviews' and cannot view it");
                            } 

                        } else {
                            console.log("Token verification failed!");
                        }
                        
                    });

                })
                break;
            case "Opinion publishing":
                token_str = "Bearer "+this.state.token;
                fetch('/decode' ,{
                    method: "GET",
                    headers: new Headers({
                        Authorization: token_str
                    })
                })
                .then((ret) => {                    
                    ret.json().then((val) => { 
                        if(val.token.username.length > 0){ 
                            verified = true;
                            alert("Token Verified for "+val.token.username);
                        } else{
                            alert("Token NOT verified (no username found in decoded token)");
                        } 
                    })
                    .then(async () => {
                        if(verified){                             
                            let response = await fetch('/OU/opinion_publishing/'+this.state.username , {
                                method: "GET"
                            })
                           
                            let json = await response.json();


                            if(json.message === "success"){
                                this.setState( {OU: "opinion_publishing" , divisions: json.divisions , ou_obj: json.ou_obj} , () => {
                                    alert(this.state.username+" authenticated for "+this.state.OU+"\nRedirecting..."); 
                                });
                            } else {
                                alert(this.state.username+" does not belong to 'opinion_publishing' and cannot view it");
                            } 

                        } else {
                            console.log("Token verification failed!");
                        }
                        
                    });

                })
                break;
            default:
                alert(ou_name+" is not a valid organizational unit!");
                break;
        }
    }

    /**
     * 
     * @param div_name name of the division being selected
     */
    async SelectDiv(div_name){

        let x = 0;
        let found = false;

        //checking if the active user is an admin to determine whether division permissions need to be overrideden
        if(this.state.role === 'admin'){
            found = true;
            console.log("Admin identified, overriding division perms...");
            
            //find division that matches div_name to get creds
            let creds_found = false;
            while((!creds_found) && (x<this.state.divisions.length)){
                if(this.state.divisions[x].name === div_name){
                    creds_found = true;
                } else ++x;
            }
            //updating state with the selected division's information if the user is an admin
            this.setState( {division: div_name , creds: this.state.divisions[x].creds} , () => alert("Welcome to the credentials repo for "+this.state.divisions[x].name+" , "+this.state.username));
        }

        //searching for the specified division
        while((!found) && (x<this.state.divisions.length)){ 
            if( ((this.state.divisions[x].allowedusers).includes(this.state.username)) && (this.state.divisions[x].name === div_name) ){  
                found = true;                

                //updating component state with the division's information
                this.setState( {division: this.state.divisions[x].name , creds: this.state.divisions[x].creds} , () => alert("Welcome to the credentials repo for "+this.state.divisions[x].name+" , "+this.state.username));
            } else {
                ++x;
            } 
        }

        //displaying an appropriate message if the user does not have permission to access the division
        if (!found)
            alert(this.state.username+" does not have access to this division!")            

    }

    /**
     * updates the username of the new account 
     * @param event event object that represents the onChange event 
     */
    UpdateUsername = (event) => {
        this.active_username = event.target.value;
        console.log("Username: ",this.active_username);
    }

    /**
     * updates the password of the new account 
     * @param event event object that represents the onChange event 
     */
    UpdatePassword = (event) => {
        this.active_password = event.target.value;
        console.log("Password: ",this.active_password);
    }

    /**
     * component that returns various DOM elements that the user can use to log in or register a new account
     * @returns login and registration components
     */
    LoginComps(){
        return(
            <div className="login">
                <input className="input-field" id="inUsername" placeholder="username" onChange={this.UpdateUsername} /><br/>
                <input className="input-field" id="inPassword" placeholder="password" onChange={this.UpdatePassword}/><br/><br/>
                <button className="authentication-button" onClick={() => this.LogIn()}>Login</button><button className="authentication-button" onClick={() => this.Register()}>Register</button>
            </div>
        );
    }

    /**
     * component that displays various buttons representing organisational units
     * @returns various buttons representing organisational units
     */
    OU_Display(){
        return(
            <div>
                <button className="OU" onClick={async () => this.SelectOU("News management")}>News management</button><button className="OU" onClick={async () => this.SelectOU("Software reviews")}>Software reviews</button><br/>
                <button className="OU" onClick={async () => this.SelectOU("Hardware reviews")}>Hardware reviews</button><button className="OU" onClick={async () => this.SelectOU("Opinion publishing")}>Opinion publishing</button>
            </div>
        )
    }

    /**
     * component that displays various buttons representing divisions
     * @returns various buttons representing divisions
     */
    DivDisplay(){
        return(
            <div>
                <button className="division" onClick={async () => this.SelectDiv("finances")}>finances</button><button className="division" onClick={async () => this.SelectDiv("IT")}>IT</button><button className="division" onClick={async () => this.SelectDiv("writing")}>writing</button><button className="division" onClick={async () => this.SelectDiv("development")}>development</button><button className="division" onClick={async () => this.SelectDiv("management")}>management</button><br/>
                <button className="division" onClick={async () => this.SelectDiv("advertising")}>advertising</button><button className="division" onClick={async () => this.SelectDiv("design")}>design</button><button className="division" onClick={async () => this.SelectDiv("public_relations")}>public_relations</button><button className="division" onClick={async () => this.SelectDiv("editing")}>editing</button><button className="division" onClick={async () => this.SelectDiv("publishing")}>publishing</button>
            </div>
        )
    }
}