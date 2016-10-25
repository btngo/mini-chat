'use strict';

angular.module('tchat')
  .factory('tchatAPI', function($http) {
    var getMessages = function() {
      return $http.get('/messages', {});
    };

    var getUsers = function() {
      return $http.get('/usersConnected', {});
    };

    return {
      getMessages: getMessages,
      getUsers: getUsers
    }

  });