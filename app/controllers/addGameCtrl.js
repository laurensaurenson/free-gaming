"use strict";

app.controller( 'addGameCtrl', function ($scope, GameStorage, AuthFactory) {

  $scope.newGame = {
    name: "",
    desc: "",
    tags: "",
    url: "",
    uid: "",
    pic: ""
  };

  $scope.addGameLink = true;

  $scope.useLink = function () {
    $scope.addGameLink = true;
  };

  $scope.useCode = function () {
    $scope.addGameLink = false;
  };

  $scope.addGame = function () {
    console.log("new game", $scope.newGame);
    GameStorage.postGame($scope.newGame, AuthFactory.getUser())
    .then( function (object) {
      console.log("object", object);
    });
  };

})