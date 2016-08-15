"use strict";

app.controller('editGameCtrl', function ($scope, $state, $stateParams, GameStorage) {

  $scope.selectedGame = {};

  GameStorage.getGames()
  .then(function(gameCollection) {
    $scope.games = gameCollection;
    $scope.selectedGame = $scope.games.filter(function (game) {
      return game.id === $stateParams.gameId;
    })[0];
    console.log("games: ", $scope.selectedGame);
  });

  $scope.editGame = function (gameId) {
    console.log("gameId", gameId);
    GameStorage.editGame(gameId, $scope.selectedGame)
    .then(function(gameObject) {
      console.log("gameObject", gameObject);
      $state.go("userGames");
    });
  };

});