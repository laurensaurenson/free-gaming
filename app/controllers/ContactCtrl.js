"use strict";

app.controller("ContactCtrl", function ($scope) {

  $scope.sentMail = false;

  $scope.newEmail = {
    userEmail: "",
    userName: "",
    userMessage: ""
  };

  $scope.sendMessage = function () {
    $scope.newEmail = {
      userEmail: "",
      userName: "",
      userMessage: ""
    };
    $scope.sentMail = true;
  };

});