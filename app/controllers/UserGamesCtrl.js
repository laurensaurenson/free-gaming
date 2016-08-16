"use strict";

app.controller('UserGamesCtrl', function ($scope, $state, GameStorage, AuthFactory) {

$scope.games = {};

  if (!AuthFactory.isAuthenticated()) {
    $state.go("login");
  } 

// $scope.userId = AuthFactory.getUser();

$scope.delete = function (gameId) {
  console.log("gameId", gameId);
  GameStorage.deleteGame(gameId)
  .then(function (object) {
    console.log("deleted: ", object);
  })
};

$scope.goAddGame = function () {
  $state.go("addGame");
};

$scope.viewAllGames = function () {
    $state.go("game");
  }

  $scope.userId = AuthFactory.getUser();

GameStorage.getUserGames($scope.userId)
  .then( function (object) {
    $scope.games = object
    console.log("object", $scope.games);
  });

})