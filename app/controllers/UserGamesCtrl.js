"use strict";

app.controller('UserGamesCtrl', function ($scope, GameStorage, AuthFactory) {

$scope.games = {};

// $scope.userId = AuthFactory.getUser();

$scope.delete = function (gameId) {
  console.log("gameId", gameId);
  GameStorage.deleteGame(gameId)
  .then(function (object) {
    console.log("deleted: ", object);
  })
};

GameStorage.getUserGames($scope.userId)
  .then( function (object) {
    $scope.games = object
    console.log("object", $scope.games);
  });

})