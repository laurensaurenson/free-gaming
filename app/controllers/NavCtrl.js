"use strict";

app.controller("NavCtrl", function ($scope, $state, AuthFactory) {

  $scope.home = function () {
    $state.go("index");
  };

  $scope.game = function () {
    $state.go("game");
  };

  $scope.about = function () {
    $state.go("about");
  };

  $scope.contact = function () {
    $state.go("contact");
  };

  $scope.userGames = function () {
    $state.go("userGames");
  };

  $scope.login = function () {
    // AuthFactory.authWithProvider();
    // console.log("log in");
    $state.go("login");
  }

});