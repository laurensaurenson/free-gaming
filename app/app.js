"use strict";

var app = angular.module('game', ['ui.router'])
.constant('FirebaseURL', "https://game-capstone.firebaseio.com/");

app.config(function ($stateProvider, $urlRouterProvider, FBCreds) {

  let authConfig = {
    apiKey: FBCreds.apiKey,
    authDomain: FBCreds.authDomain,
    databaseURL: FBCreds.databaseURL,
    storageBucket: FBCreds.storageBucket
  };
  firebase.initializeApp(authConfig);

  $stateProvider
  .state('index', {
    url: '',
    templateUrl: 'partials/home.html',
    controller: 'HomeCtrl'
  })
  .state('game', {
    url: '/game',
    templateUrl: 'partials/game.html',
    controller: 'GameCtrl'
  })
  .state('about', {
    url: '/about',
    templateUrl: 'partials/about.html'
  })
  .state('contact', {
    url: '/contact',
    templateUrl: 'partials/contact.html',
    controller: 'ContactCtrl'
  });
  $urlRouterProvider.otherwise('index');


});