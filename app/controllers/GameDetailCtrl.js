"use strict";

app.controller("GameDetailCtrl", function($scope, GameStorage, AuthFactory, $stateParams) {
  $scope.games = [];
  $scope.selectedGame = {};
  $scope.selectedGameComments = [];
  $scope.commentSection = true;
  $scope.newComment = {
    userName: "",
    comment: ""
  };

  $scope.showCommentSection = function () {
    $scope.commentSection = false;
  };

  $scope.hideCommentSection = function () {
    $scope.commentSection = true;
  };

  $scope.addComment = function (newComment) {
    $scope.newComment.userName = AuthFactory.getUserName();
    $scope.newComment.uid = AuthFactory.getUser();
    $scope.newComment.gameId = $stateParams.gameId;
    GameStorage.postComment($scope.newComment)
    .then(function(commentObject) {
      console.log("commentObject: ", commentObject);
    });
  };

  GameStorage.getGames()
  .then(function(gameCollection) {
    $scope.games = gameCollection;
    $scope.selectedGame = $scope.games.filter(function (game) {
      return game.id === $stateParams.gameId;
    })[0];
    console.log("games: ", $scope.games);
  });

  GameStorage.getComments()
  .then(function(commentCollection) {
    $scope.comments = commentCollection;
    $scope.selectedGameComments = $scope.comments.filter(function (comment) {
      return comment.gameId === $stateParams.gameId;
    });
    console.log("comments: ", $scope.comments);
  });


});