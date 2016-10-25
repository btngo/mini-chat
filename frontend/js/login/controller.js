'use strict';

angular.module('tchat')
  .controller('loginController', function($scope, $location, $http, $cookies) {
    var loginCtrl = this;

    this.connectUser = function() {
      console.log($scope.credentials);
      $http.post('/login', $scope.credentials).then(
        function(res) {
          console.log('login success');
          var pseudo = $scope.credentials.username;
          $cookies.put('userName', pseudo);
          $location.path('chat');
        },
        function(err) {
          console.log('login error', err);
          $scope.logginError = true;
        }
      );
    };
  });