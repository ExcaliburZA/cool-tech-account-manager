const mongoose  = require('mongoose');

let OU_schema = mongoose.Schema({
    allowedusers:{
       type: Array,
       required: true,
       default: []
    },
    ou_name:{
        type: String,
        required: true,
        default: "unknown OU",       
    },
    divisions:{
        type: Array,
        
        allowedusers: {
            type: Array,
            required: true,
            default: []
        },
        name: {
            type: String,
            required: true,
            default: "unknown division"
        },
        creds:{
            type: Array,
            default: [],
        }               
    }
    
} , {collection: 'ous'});

let OU = mongoose.model('OU' , OU_schema);
module.exports = OU;