const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password:  {type: String, required: false},
    picture:  {type: String, required: false, default: null},
    googleId:  {type: String, required: false, default: null}
},
{
    timestamps: true
});

const User = mongoose.model('OAuth-User', userSchema);

module.exports = User;