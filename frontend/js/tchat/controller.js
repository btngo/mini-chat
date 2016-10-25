'use strict';

angular.module('tchat')
  .controller('tchatController', function($location, $cookies, $timeout, tchatAPI) {
    var userName = $cookies.get('userName');
    if (!userName) {
      $location.path('login');
    }
    var chatCtrl = this;
    chatCtrl.messageList = [];
    chatCtrl.userList = [];
    tchatAPI.getMessages().then(
      function(response) {
        chatCtrl.messageList = response.data;
      }, function(err) {
        console.log(err);
      }
    );
    tchatAPI.getUsers().then(
      function(response) {
        chatCtrl.userList = response.data;
        if (chatCtrl.userList.indexOf(userName) == -1) {
          chatCtrl.userList.unshift(userName);
        }
      }, function(err) {
        console.log(err);
      }
    );
    var socket = io('/chat').connect('http://localhost:8000');
    socket.emit('new_client', userName);
    chatCtrl.sendMessage = function() {
      socket.emit('message', chatCtrl.message);
      $timeout(insertMessage(userName, chatCtrl.message), 200);
      chatCtrl.message = '';
    };

    socket.on('new_client', function(user) {
      addNewUser(user);
    });

    socket.on('message', function(data) {
      $timeout(insertMessage(data.pseudo, data.message), 200);
    });

    socket.on('client_disconnect', function(user) {
      $timeout(chatCtrl.userList.splice(chatCtrl.userList.indexOf(user), 1), 200);
    });

    function addNewUser(user) {
      if (chatCtrl.userList.indexOf(user) == -1) {
        $timeout(chatCtrl.userList.push(user), 200);
      }
    }
    function insertMessage(pseudo, mes) {
      chatCtrl.messageList.unshift({sender: pseudo, message: mes});
    }

  });
