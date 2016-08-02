"use strict";

app.controller("GameCtrl", function ($scope, GameStorage) {

  $scope.name = "game";

  $scope.scores = [];

  GameStorage.getScores()
  .then( function (score) {
    $scope.scores = score;
  });

});