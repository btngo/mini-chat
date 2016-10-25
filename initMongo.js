var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Tchat');
var User = require('./backend/database/userSchema');
var newUser1 = new User({
  username: 'user1',
  password: 'user1'
});
var newUser2 = new User({
  username: 'user2',
  password: 'user2'
});
var newAdmin = new User({
  username: 'admin',
  password: 'admin'
});
newUser1.save(function(err) {
  if (err) throw err;
  console.log('User 1 saved successfully!');
});

newUser2.save(function(err) {
  if (err) throw err;
  console.log('User 2 saved successfully!');
});

newAdmin.save(function(err) {
  if (err) throw err;
  console.log('Admin saved successfully!');
});
mongoose.connection.close();