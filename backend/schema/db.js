const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname:String,
    lastname:String,
    username:String,
    password:String
})

const accountSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

const Account = mongoose.model("Account", accountSchema);
const User = mongoose.model("User",userSchema);
module.exports ={
                    User,
                    Account
                }; 