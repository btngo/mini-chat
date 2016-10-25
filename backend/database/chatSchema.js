var mongoose = require('mongoose');

var chatSchema = mongoose.Schema({
  sender     : String,
  message     : String,
  creation_date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Chat', chatSchema);