"use strict";

app.controller("GameCtrl", function ($scope, GameStorage, AuthFactory) {

  $scope.scores = [];

  $scope.gameView = true;
  $scope.loginView = false;

  $scope.showGame = function () {
    $scope.gameView = true;
  };

  $scope.showScores = function () {
    $scope.gameView = false;
    console.log("scores: ", $scope.scores);
  };

  $scope.showModal = function () {
    $scope.loginView = true;
    
  }

  if ( !AuthFactory.getUser() ) {
    console.log("not logged in");
    $scope.loginView = true;
  }

  GameStorage.getScores()
  .then( function (score) {
    for ( var i = 1; i < 11; i++ ) {
      $scope.scores.push(score[score.length-i]);
    }
  });

});