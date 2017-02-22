var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
// define the schema for our user model
var userSchema = mongoose.Schema({

  email: { type: String },
  password: { type: String },
  displayName: String,
  description: String,
  toDelete: Boolean,
  picture: String,
  bitbucket: String,
  facebook: String,
  foursquare: String,
  google: String,
  github: String,
  instagram: String,
  linkedin: String,
  live: String,
  yahoo: String,
  twitter: String,
  twitch: String

});



userSchema.pre('save', function(next) {
  console.log('userSchema save');
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
module.exports = mongoose.model('User', userSchema);
 
