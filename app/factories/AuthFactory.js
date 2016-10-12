"use strict";

app.factory("AuthFactory", function () {

  let currentUserId = null;
  let currentUser = null;
  let provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().onAuthStateChanged(function(user) {
    if(user) {
      console.log("User logged in", user.uid);
      currentUser = user.displayName.split(" ")[0];
      currentUserId = user.uid;
    } else {
      console.log("user not logged in");
    }
  });

  var authWithProvider = function () {
    return firebase.auth().signInWithPopup(provider);
  };

  var signOut = function () {
    currentUserId = null;
    currentUser = null;
    return firebase.auth().signOut();
  };

  let isAuthenticated = function () {
    return (currentUserId) ? true: false;
  };

  let getUser = function() {
    return currentUserId;
  };

  let getUserName = function () {
    return currentUser;
  }

  return {
    authWithProvider, isAuthenticated, getUser, signOut, getUserName
  };

});