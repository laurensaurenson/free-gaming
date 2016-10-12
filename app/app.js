"use strict";

var app = angular.module('game', ['ui.router', 'angularModalService'])
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
    templateUrl: 'partials/gameList.html',
    controller: 'GameCtrl'
  })
  .state('addGame', {
    url: '/addGame',
    templateUrl: 'partials/addGame.html',
    controller: 'addGameCtrl'
  })
  .state('editGame', {
    url: '/edit/:gameId',
    templateUrl: 'partials/editGame.html',
    controller: 'editGameCtrl'
  })
  .state('gameDetail', {
    url: '/game/:gameId',
    templateUrl: 'partials/gameDetails.html',
    controller: 'GameDetailCtrl'
  })
  .state('userGames', {
    url: '/user/game',
    templateUrl: 'partials/userGames.html',
    controller: 'UserGamesCtrl'
  })
  .state('about', {
    url: '/about',
    templateUrl: 'partials/about.html'
  })
  .state('contact', {
    url: '/contact',
    templateUrl: 'partials/contact.html',
    controller: 'ContactCtrl'
  })
  .state('login', {
    url: '/login',
    templateUrl: 'partials/login.html',
    controller: 'LoginCtrl'
  });
  $urlRouterProvider.otherwise('index');


});