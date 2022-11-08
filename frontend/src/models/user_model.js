const mongoose  = require('mongoose');

let UserSchema = mongoose.Schema({
    username:{
        type: String,
        required: true,
        default: "Unknown username"
    },
    password:{
        type: String,
        required: true,
        default: "Unknown password"
    },
    role:{
        type: String,
        required: true,
        default: "normal"
    },
}, {collection: 'users'});

let User = mongoose.model('User' , UserSchema);
module.exports = User;