var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username     : String,
  password     : String
});

userSchema.methods.verifyPassword = function(password) {
  return password == this.password;
};

module.exports = mongoose.model('User', userSchema);