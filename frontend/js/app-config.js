'use strict';

angular.module('tchat', [
  'ngMaterial',
  'ngCookies',
  'ngRoute'
])
  .config(function config($routeProvider) {
    $routeProvider.
      when('/login', {
        template: '<login></login>'
      }).
      when('/chat', {
        template: '<tchat></tchat>'
      }).
      otherwise('/login');
  }
);
