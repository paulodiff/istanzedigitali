var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
// define the schema for our user model
var userLoginSchema = mongoose.Schema({


    userId : { type: String }, 
    userProvider : { type: String },
    userEmail: { type: String },
    ts: { type : Date, default: Date.now }

});


/*

userSchema.pre('save', function(next) {
  console.log('userLoginSchema save');
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }

  
  bcrypt.genSalt(10, function(err, salt) {
    if(err) console.log(err);
    console.log(salt);
    console.log(user.password);
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if(err) console.log(err);
      console.log(hash);
      user.password = hash;
      next();
    });
  });
  
});

userSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};
*/

/*
// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};
*/

// create the model for users and expose it to our app
module.exports = mongoose.model('UserLogin', userLoginSchema);
 
