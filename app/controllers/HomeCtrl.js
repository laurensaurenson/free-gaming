"use strict";

app.controller("HomeCtrl", function ($scope, $state, AuthFactory, GameStorage) {

  $scope.name = "home";

  if (!AuthFactory.isAuthenticated()) {
    $state.go("login");
  } 

  $scope.sampleGames = [];

  $scope.randomNumber = function (maxNumber) {
    return Math.floor(Math.random() * (maxNumber - 0)) + 0;
  };

  GameStorage.getGames()
  .then(function(games) {
    let number = $scope.randomNumber(games.length-2);
    for (let i = 0; i < 3; i++) {
      $scope.sampleGames.push(games[number]);
      number ++;
    }
    console.log("sample games", $scope.sampleGames);
  });

});