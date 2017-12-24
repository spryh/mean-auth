//import { userInfo } from 'os';

var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

//Trim removes whitespace
var UserSchema = new  mongoose.Schema({
    email: {type: String, unique: true, required: true, trim: true},
    name: {type: String, required: true, trim: true},
    favoriteBook: {type: String, required: true, trim: true},
    password: {type: String, required: true}
})

// Hash password before storage with Save pre hook
UserSchema.pre('save', function(next){
    var user = this
    // 10 is a good balance between security and performance
    bcrypt.hash(user.password, 10, (err,hash)=>{
        if(err) {return next (err)}
        else {
            user.password = hash
            next()
        }
    })
})

var User = mongoose.model('User', UserSchema)
module.exports = User 