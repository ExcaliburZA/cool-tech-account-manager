const express = require('express');
const app = express();
const helmet = require('helmet');
const jwt = require('jsonwebtoken')
const PORT = process.env.PORT || 5000;

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded( {extended: true} ));
app.use(bodyParser.json());
app.use(helmet());

const user_controller = require('./controllers/users.controller');
const OU_controller = require('./controllers/OU.controller');

//login endpoint
app.post('/login/:username/:password' , user_controller.LogIn)

//registration endpoint
app.post('/register/:username/:password' , user_controller.RegisterUser)

//new repo account insertion endpoint
app.post('/new/:ou_name' , OU_controller.UpdateOU)

//user account role update endpoint
app.post('/role-update/:username/:new_role' , user_controller.UpdateRole)

//update repo account insertion endpoint
app.post('/update/:ou_name' , OU_controller.UpdateCreds)

//user searching endpoint
app.get('/search/:username' , user_controller.Search)

//JWT token decoding endpoint
app.get('/decode' , (req, res) =>{
    //extracting JWT token from headers 
    const token = req.headers['authorization'].split(' ')[1];   

    //attemping to verify the JWT token and sending back an appropriate response based on the result
    try{
        const decoded = jwt.verify(token , 'jwt-secret');
        res.send({token: decoded});
    } catch (e) {
        console.log('Error verifying JWT token: ', token);
        res.send( {token: {username: ""}} );
    }
})

//user account deletion endpoint
app.post('/delete/:username', user_controller.DeleteUser);

//organisational unit fetch endpoint
app.get('/OU/:OU_name/:username' ,  OU_controller.View_OU)

//connects to the MongoDB database
mongoose.connect("mongodb+srv://excalibur:letmein_420@hyperiondev-123.xbqtwuq.mongodb.net/cool-tech-db?retryWrites=true&w=majority" , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then( () => console.log("MongoDB connected"))
.catch((err) => {
    console.log("ERROR: ",err.message);
})

//method that indicates thats a connection to the MongoDB database was unsuccessful
mongoose.connection.on('error' , function() {
    //console.log('MongoDB connection established');
        console.log('Could not connect to MongoDB database. Exiting...');
        process.exit();
})

//method that indicates thats a connection to the MongoDB database was successful
mongoose.connection.once('open', function() {
    console.log("Successfully connected to the database");
    app.listen(PORT, () => console.log("Listening in on port ", PORT));
})

//allowing express to render React components where appropriate
if (process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, 'frontend/build')));
    app.get('*',(req,res)=> {res.sendFile(path.resolve(__dirname,
    'frontend', 'build','index.html'));
    });
}