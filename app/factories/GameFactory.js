"use strict";

app.factory("GameStorage", function (FirebaseURL, $q, $http) {

  let getScores = function () {
    let scores = [];
    return $q(function(resolve, reject) {
      $http.get(`${FirebaseURL}/scores.json`)
      .success(function(scoreObject){
        if (scoreObject) {
          Object.keys(scoreObject).forEach(function(key) {
            scoreObject[key].id = key;
            scores.push(scoreObject[key]);
          });
        }
        resolve(scores);
        })
        .error(function(error){
          reject(error);
      });
    });
  };

  return {
    getScores
  }

})