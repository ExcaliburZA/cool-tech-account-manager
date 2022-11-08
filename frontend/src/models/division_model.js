const mongoose  = require('mongoose');

let DivSchema = mongoose.Schema({
    users: {
        type: Array,
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
    }
});

let Division = mongoose.model('User' , DivSchema);
module.exports = Division;