var express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server),
  passport = require('passport'),
  mongoose = require('mongoose'),
  flash = require('connect-flash'),
  chatSchema = require('./database/chatSchema');

require('./database/passport-strategy')(passport);
mongoose.connect('mongodb://localhost/Tchat');

app.use(express.bodyParser());
app.use(express.static( __dirname.replace('/backend', '/frontend')));
app.use(express.cookieParser());
app.use(express.session({ secret: 'secret' }));
app.use(passport.initialize());
app.use(flash());

var connectedUser = [];
app.get('/', function (req, res) {
  res.sendfile(__dirname.replace('/backend', '/frontend/index.html'));
});

app.get('login', function(request, response) {
  response.render(__dirname.replace('/backend', '/frontend/index.html'), { message: request.flash('error') });
});

app.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }
));
app.get('/messages', function (req, res) {
  chatSchema.find({}, {}, {
    limit:100,
    sort:{
      creation_date: -1
    }}, function(err, chats) {
    res.send(chats);
  });
});

app.get('/usersConnected', function (req, res) {
  res.send(connectedUser);
});

var chat_namespace = io.of('/chat');
chat_namespace.on('connection', function (socket, pseudo) {
  socket.on('new_client', function(pseudo) {
    console.log('new client', pseudo);
    socket.pseudo = pseudo;
    if (connectedUser.indexOf(pseudo) == -1) {
      connectedUser.push(pseudo);
    }
    socket.broadcast.emit('new_client', pseudo);
  });

  socket.on('disconnect', function() {
    console.log('client disconnected', socket.pseudo);
    connectedUser.splice(connectedUser.indexOf(socket.pseudo), 1);
    socket.broadcast.emit('client_disconnect', socket.pseudo);
  });

  socket.on('message', function (message) {
    console.log('message', message);
    console.log('socket.pseudo', socket.pseudo);
    var chatItem = new chatSchema({
      sender: socket.pseudo,
      message: message,
      creation_date: Date.now()
    });
    chatItem.save(function(err) {
      if (err) throw err;
      console.log('chat message stored: ' + message);
    });
    socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
  });
});

server.listen(8000);
