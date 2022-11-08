const mongoose  = require('mongoose');

let CredSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        default: "Unknown username"
    },
    password: {
        type: String,
        required: true,
        default: "Unknown username"
    }

} , {collection: 'ous'});

let CredSet = mongoose.model('CredSet' , CredSchema);
module.exports = CredSet;