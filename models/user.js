var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

//Trim removes whitespace
var UserSchema = new  mongoose.Schema({
    email: {type: String, unique: true, required: true, trim: true},
    name: {type: String, required: true, trim: true},
    favoriteBook: {type: String, required: true, trim: true},
    password: {type: String, required: true}
})

// Create an AUTHENTICATE function in the UserSchema model that checks input against database document
// Statics allows adding methods to model
UserSchema.statics.authenticate = function(email, password, callback){
    User.findOne({email: email})
        .exec((error, user)=>{
            if(error) { return callback(error)}
            else if (!user) {
                var err = new Error('User not found')
                err.status = 401
                return callback(err)
            } else {
                bcrypt.compare(password, user.password, (error, result)=>{
                    if(result == true) { 
                        // Null indicates no error
                        return callback(null, user)
                    } else { return callback()}
                })
            }
        })
}



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