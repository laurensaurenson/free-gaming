"use strict";

app.factory("GameStorage", function (FirebaseURL, $q, $http) {

  let postGame = function (newGame, userId) {
    newGame.uid = userId;
    console.log("userId", userId);
    return $q(function(resolve, reject) {
      $http.post(
        `${FirebaseURL}games.json`,
        JSON.stringify(newGame)
      )
      .success(function(gameObject) {
        resolve(gameObject);
      })
      .error(function(error) {
        reject(error);
      });
    });
  };

  let getGames = function () {
    let games = [];
    return $q(function(resolve, reject) {
      $http.get(`${FirebaseURL}games.json`)
      .success(function(gameObject) {
        if(gameObject) {
          Object.keys(gameObject).forEach(function(key) {
            gameObject[key].id = key;
            games.push(gameObject[key]);
          });
        }
        resolve(games);
      })
      .error(function(error) {
        reject(error);
      });
    });
  };

  let getUserGames = function (userId) {
    console.log("userId", userId);
    let games = [];
    return $q(function(resolve, reject) {
      $http.get(`${FirebaseURL}games.json`)
      .success(function(gameObject) {
        if(gameObject) {
          Object.keys(gameObject).forEach(function(key) {
            gameObject[key].id = key;
            if (gameObject[key].user === userId){

              games.push(gameObject[key]);
            }
          });
        }
        resolve(games);
      })
      .error(function(error) {
        reject(error);
      });
    });
  };

  let postComment = function (newComment) {
    console.log("new comment: ", newComment);
    return $q(function (resolve, reject) {
      $http.post(
        `${FirebaseURL}comments.json`,
        JSON.stringify(newComment)
      )
      .success(function (commentObject) {
        resolve(commentObject);
      })
      .error(function(error) {
        reject(error);
      });
    });
  };

  let getComments = function () {
    let comments = [];
    return $q(function(resolve, reject) {
      $http.get(`${FirebaseURL}comments.json`)
      .success(function(commentObject) {
        if(commentObject) {
          Object.keys(commentObject).forEach(function(key) {
            commentObject[key].id = key;
            comments.push(commentObject[key]);
          });
        }
        resolve(comments);
      })
      .error(function(error) {
        reject(error);
      });
    });
  };

  let deleteGame = function(id) {
    return $q(function(resolve, reject) {
      $http.delete(
        `${FirebaseURL}/games/${id}.json`
      )
      .success(function() {
        resolve();
      })
      .error(function(error) {
        reject(error);
      });
    });
  };

  let editGame = function (id, gameObject) {
    return $q(function(resolve, reject) {
      $http.put(
        `${FirebaseURL}/games/${id}.json`,
        JSON.stringify(gameObject)
      )
      .success(function(object) {
        resolve(object)
      })
      .error(function(error) {
        error
      });
    });
  };

  // let getScores = function () {
  //   let scores = [];
  //   return $q(function(resolve, reject) {
  //     $http.get(`${FirebaseURL}/scores.json`)
  //     .success(function(scoreObject){
  //       if (scoreObject) {
  //         Object.keys(scoreObject).forEach(function(key) {
  //           scoreObject[key].id = key;
  //           scores.push(scoreObject[key]);
  //         });
  //       }
  //       console.log("scores", scoreObject );
  //       resolve(scores);
  //       })
  //       .error(function(error){
  //         reject(error);
  //     });
  //   });
  // };

  // let getUserScores = function (userId) {

  //   let scores = [];

  //   console.log("userId", userId);
  //   return $q(function(resolve, reject) {
  //     $http.get(`${FirebaseURL}/scores.json?orderBy="uid"&equalTo="${userId}"`)
  //     .success(function(scoreObject) {
  //       if (scoreObject) {
  //         Object.keys(scoreObject).forEach(function(key) {
  //           scoreObject[key].id = key;
  //           scores.push(scoreObject[key]);
  //         });
  //       }
  //       console.log("scoreObject", scoreObject);
  //       resolve(scores);
  //     });
  //   });
  // };

  return {
    getGames, postGame, postComment, getComments, getUserGames, deleteGame, editGame
  }

})