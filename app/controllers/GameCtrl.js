"use strict";

app.controller("GameCtrl", function ($scope, $state, GameStorage, AuthFactory) {

  $scope.games = [];
  $scope.userScores = [];

  $scope.gameView = true;

  $scope.showGame = function () {
    $scope.gameView = true;
  };

  $scope.showScores = function () {
    $scope.gameView = false;
  };

  if ( !AuthFactory.getUser() ) {
    $scope.loginView = true;
  }

  $scope.goAddGame = function () {
    $state.go("addGame");
  };

  GameStorage.getGames()
  .then( function (object) {
    $scope.games = object
    console.log("object", $scope.games);
  });

  // GameStorage.getScores()
  // .then( function (score) {
  //   score.sort(function (a, b) {
  //     if (a.score > b.score) {
  //       return 1;
  //     }
  //     if (a.score < b.score) {
  //       return -1;
  //     }
  //     return 0;
  //   });
  //   for ( var i = 1; i < 6; i++ ) {
  //     score[score.length-i].rank = i;
  //     $scope.scores.push(score[score.length-i]);
  //   };
  // });

  // GameStorage.getUserScores(AuthFactory.getUser())
  // .then( function (score) {
  //   score.sort(function (a, b) {
  //     if (a.score > b.score) {
  //       return 1;
  //     }
  //     if (a.score < b.score) {
  //       return -1;
  //     }
  //     return 0;
  //   });
  //   for ( var i = 1; i < 4; i++ ) {
  //     score[score.length-i].rank = i;
  //     $scope.userScores.push(score[score.length-i]);
  //   };
  // });

});