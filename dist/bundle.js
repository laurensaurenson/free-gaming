(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv');

var player;
var platform;
var background;
var evilPlatform;
var point;  
var goal;

var score = 0;

var startText;
var startButton;
var input;
var button;

var cursors;
var jumpButton;
var loginText;

var user = firebase.auth().currentUser;

var mainMenu = {

  preload: function () {

    // game.add.plugin(Fabrique.Plugins.InputField);
    game.load.image('startButton', "app/images/startButton.png");

  },

  create: function () {

    // input = game.add.inputField(30, 90);
    button = game.add.button(game.world.centerX - 95, 400, 'startButton', startGame, this, 2, 1, 0);

    // startText = game.add.text(game.world.centerX, game.world.centerY, 'Start', {font: '32px Arial', fill: '#fff'});
    loginText = game.add.text(game.world.centerX, game.world.centerY, 'Please Login to Continue', {font: '32px Arial', fill: '#fff'});
    loginText.visible = false;

    // startText.onInputUp.add(startGame, this);
    // button.onInputUp.add(startGame, this);

  },

  update: function () {

  }

};

var restartButton;



function startGame () {
  // console.log("start", input.value);
  if (!user) {
    loginText.visible = true;
    return;
  }
  game.state.start('mainState');
}

var gameOver = {

  preload: function () {
    game.load.image('startButton', "app/images/startButton.png");

  },

  create: function () {

    restartButton = game.add.button(game.world.centerX - 95, 400, 'startButton', playAgain, this, 2, 1, 0);

  },

  update: function () {

  }

};

function playAgain () {
  game.state.start('mainState');
  // console.log("play again" );

}

var playAgainButton;

var mainState = {

  preload: function () {

    game.load.image('platform', "assets/gameLayout-assets/basicPlatform.png");
    game.load.image('evilPlatform', "app/images/evilPlatform.png");
    game.load.image('player', "app/images/player.png");
    // game.load.image('player', "assets/gameLayout-assets/player.png");
    game.load.image('point', "app/images/point.png");

    game.load.image('background', 'assets/gameLayout-assets/background.png');
    game.load.image('playAgain', 'assets/gameLayout-assets/playAgain.png');

    game.load.image('startButton', "app/images/startButton.png");
    game.load.image('goal', "app/images/goal.png");


  },


  create: function () {

    background = game.add.tileSprite(0, 0, 4189, 4204, 'background');

    platform = game.add.physicsGroup();

    goal = game.add.physicsGroup();

    goal.create(1950, 400, 'goal');
    game.physics.arcade.enable(goal);

    playAgainButton = game.add.button( 50, 3950, 'playAgain', playAgain, this, 2, 1, 0);
    playAgainButton.anchor.setTo( 0.5, 0.5);
    playAgainButton.visible = false;


    platform.create(-100, 3950, 'platform');
    platform.create(650, 3950, 'platform');
    platform.create(1300, 3850, 'platform');

    point = game.add.physicsGroup();

    point.create(525, 3750, 'point');
    point.create(1100, 3750, 'point');

    game.physics.arcade.enable(point);

    // platform.visible = false;

    evilPlatform = game.add.physicsGroup();

    // evilPlatform = game.add.tileSprite(0, 650, 2000, 50, 'evilPlatform')
    evilPlatform.create(0, 4200, 'evilPlatform');
    // evilPlatform.visible = false;
    evilPlatform.setAll('body.immovable', true);


    player = game.add.sprite(100, 3742, 'player');
    // player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');

    game.physics.arcade.enable(player);

    game.world.setBounds(0, 0, 4189, 4204);

    player.body.collideWorldBounds = true;
    player.body.gravity.y = 500;

    platform.setAll('body.immovable', true);

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);

  },

  update: function () {

    game.physics.arcade.collide(player, evilPlatform, death);

    game.physics.arcade.collide(player, goal, winGame);

    // game.physics.arcade.collide(player, evilPlatform);

    game.physics.arcade.collide(player, platform, function () {
    });

    game.physics.arcade.overlap(player, point, scorePoint);

    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -250;
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 250;
    }

    if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down))
    {
        player.body.velocity.y = -400;
    }

  }

};

function winGame ( player, goal ) {
  goal.kill();
  player.kill();
  console.log("you win");
  score += 50;
  postScore();
}

function death (player, evilPlatform) {
  playAgainButton.visible = true;
  playAgainButton.centerX = (game.camera.x + 200);
    // game.state.start('mainMenu');
  player.body.velocity.x = 0;  
  player.kill();
  console.log("death");
  postScore()
  .then( function (scoreObject) {
    console.log("final score: ", scoreObject);
  })

}

function scorePoint (player, point) {
  point.kill();
  score += 10;
}

function postScore () {
  let scoreObject = {
    score, 
    userName: user.displayName.split(" ")[0],
    uid: user.uid
  };

  return new Promise(function(resolve, reject) {
    $.ajax({
      url: "https://game-capstone.firebaseio.com/scores.json",
      type: "POST",
      data: JSON.stringify(scoreObject),
      dataType: "json"
    }).done( function ( scoreId ) {
      resolve(scoreId); 
    });
  });
}

game.state.add('mainState', mainState);

game.state.add('mainMenu', mainMenu);
// game.state.add('gameOver', gameOver);

// game.state.start('mainState');
game.state.start('mainMenu');
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9hcHAvZ2FtZS9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZ2FtZSA9IG5ldyBQaGFzZXIuR2FtZSg4MDAsIDYwMCwgUGhhc2VyLkFVVE8sICdnYW1lRGl2Jyk7XG5cbnZhciBwbGF5ZXI7XG52YXIgcGxhdGZvcm07XG52YXIgYmFja2dyb3VuZDtcbnZhciBldmlsUGxhdGZvcm07XG52YXIgcG9pbnQ7ICBcbnZhciBnb2FsO1xuXG52YXIgc2NvcmUgPSAwO1xuXG52YXIgc3RhcnRUZXh0O1xudmFyIHN0YXJ0QnV0dG9uO1xudmFyIGlucHV0O1xudmFyIGJ1dHRvbjtcblxudmFyIGN1cnNvcnM7XG52YXIganVtcEJ1dHRvbjtcbnZhciBsb2dpblRleHQ7XG5cbnZhciB1c2VyID0gZmlyZWJhc2UuYXV0aCgpLmN1cnJlbnRVc2VyO1xuXG52YXIgbWFpbk1lbnUgPSB7XG5cbiAgcHJlbG9hZDogZnVuY3Rpb24gKCkge1xuXG4gICAgLy8gZ2FtZS5hZGQucGx1Z2luKEZhYnJpcXVlLlBsdWdpbnMuSW5wdXRGaWVsZCk7XG4gICAgZ2FtZS5sb2FkLmltYWdlKCdzdGFydEJ1dHRvbicsIFwiYXBwL2ltYWdlcy9zdGFydEJ1dHRvbi5wbmdcIik7XG5cbiAgfSxcblxuICBjcmVhdGU6IGZ1bmN0aW9uICgpIHtcblxuICAgIC8vIGlucHV0ID0gZ2FtZS5hZGQuaW5wdXRGaWVsZCgzMCwgOTApO1xuICAgIGJ1dHRvbiA9IGdhbWUuYWRkLmJ1dHRvbihnYW1lLndvcmxkLmNlbnRlclggLSA5NSwgNDAwLCAnc3RhcnRCdXR0b24nLCBzdGFydEdhbWUsIHRoaXMsIDIsIDEsIDApO1xuXG4gICAgLy8gc3RhcnRUZXh0ID0gZ2FtZS5hZGQudGV4dChnYW1lLndvcmxkLmNlbnRlclgsIGdhbWUud29ybGQuY2VudGVyWSwgJ1N0YXJ0Jywge2ZvbnQ6ICczMnB4IEFyaWFsJywgZmlsbDogJyNmZmYnfSk7XG4gICAgbG9naW5UZXh0ID0gZ2FtZS5hZGQudGV4dChnYW1lLndvcmxkLmNlbnRlclgsIGdhbWUud29ybGQuY2VudGVyWSwgJ1BsZWFzZSBMb2dpbiB0byBDb250aW51ZScsIHtmb250OiAnMzJweCBBcmlhbCcsIGZpbGw6ICcjZmZmJ30pO1xuICAgIGxvZ2luVGV4dC52aXNpYmxlID0gZmFsc2U7XG5cbiAgICAvLyBzdGFydFRleHQub25JbnB1dFVwLmFkZChzdGFydEdhbWUsIHRoaXMpO1xuICAgIC8vIGJ1dHRvbi5vbklucHV0VXAuYWRkKHN0YXJ0R2FtZSwgdGhpcyk7XG5cbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcblxuICB9XG5cbn07XG5cbnZhciByZXN0YXJ0QnV0dG9uO1xuXG5cblxuZnVuY3Rpb24gc3RhcnRHYW1lICgpIHtcbiAgLy8gY29uc29sZS5sb2coXCJzdGFydFwiLCBpbnB1dC52YWx1ZSk7XG4gIGlmICghdXNlcikge1xuICAgIGxvZ2luVGV4dC52aXNpYmxlID0gdHJ1ZTtcbiAgICByZXR1cm47XG4gIH1cbiAgZ2FtZS5zdGF0ZS5zdGFydCgnbWFpblN0YXRlJyk7XG59XG5cbnZhciBnYW1lT3ZlciA9IHtcblxuICBwcmVsb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgZ2FtZS5sb2FkLmltYWdlKCdzdGFydEJ1dHRvbicsIFwiYXBwL2ltYWdlcy9zdGFydEJ1dHRvbi5wbmdcIik7XG5cbiAgfSxcblxuICBjcmVhdGU6IGZ1bmN0aW9uICgpIHtcblxuICAgIHJlc3RhcnRCdXR0b24gPSBnYW1lLmFkZC5idXR0b24oZ2FtZS53b3JsZC5jZW50ZXJYIC0gOTUsIDQwMCwgJ3N0YXJ0QnV0dG9uJywgcGxheUFnYWluLCB0aGlzLCAyLCAxLCAwKTtcblxuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuXG4gIH1cblxufTtcblxuZnVuY3Rpb24gcGxheUFnYWluICgpIHtcbiAgZ2FtZS5zdGF0ZS5zdGFydCgnbWFpblN0YXRlJyk7XG4gIC8vIGNvbnNvbGUubG9nKFwicGxheSBhZ2FpblwiICk7XG5cbn1cblxudmFyIHBsYXlBZ2FpbkJ1dHRvbjtcblxudmFyIG1haW5TdGF0ZSA9IHtcblxuICBwcmVsb2FkOiBmdW5jdGlvbiAoKSB7XG5cbiAgICBnYW1lLmxvYWQuaW1hZ2UoJ3BsYXRmb3JtJywgXCJhc3NldHMvZ2FtZUxheW91dC1hc3NldHMvYmFzaWNQbGF0Zm9ybS5wbmdcIik7XG4gICAgZ2FtZS5sb2FkLmltYWdlKCdldmlsUGxhdGZvcm0nLCBcImFwcC9pbWFnZXMvZXZpbFBsYXRmb3JtLnBuZ1wiKTtcbiAgICBnYW1lLmxvYWQuaW1hZ2UoJ3BsYXllcicsIFwiYXBwL2ltYWdlcy9wbGF5ZXIucG5nXCIpO1xuICAgIC8vIGdhbWUubG9hZC5pbWFnZSgncGxheWVyJywgXCJhc3NldHMvZ2FtZUxheW91dC1hc3NldHMvcGxheWVyLnBuZ1wiKTtcbiAgICBnYW1lLmxvYWQuaW1hZ2UoJ3BvaW50JywgXCJhcHAvaW1hZ2VzL3BvaW50LnBuZ1wiKTtcblxuICAgIGdhbWUubG9hZC5pbWFnZSgnYmFja2dyb3VuZCcsICdhc3NldHMvZ2FtZUxheW91dC1hc3NldHMvYmFja2dyb3VuZC5wbmcnKTtcbiAgICBnYW1lLmxvYWQuaW1hZ2UoJ3BsYXlBZ2FpbicsICdhc3NldHMvZ2FtZUxheW91dC1hc3NldHMvcGxheUFnYWluLnBuZycpO1xuXG4gICAgZ2FtZS5sb2FkLmltYWdlKCdzdGFydEJ1dHRvbicsIFwiYXBwL2ltYWdlcy9zdGFydEJ1dHRvbi5wbmdcIik7XG4gICAgZ2FtZS5sb2FkLmltYWdlKCdnb2FsJywgXCJhcHAvaW1hZ2VzL2dvYWwucG5nXCIpO1xuXG5cbiAgfSxcblxuXG4gIGNyZWF0ZTogZnVuY3Rpb24gKCkge1xuXG4gICAgYmFja2dyb3VuZCA9IGdhbWUuYWRkLnRpbGVTcHJpdGUoMCwgMCwgNDE4OSwgNDIwNCwgJ2JhY2tncm91bmQnKTtcblxuICAgIHBsYXRmb3JtID0gZ2FtZS5hZGQucGh5c2ljc0dyb3VwKCk7XG5cbiAgICBnb2FsID0gZ2FtZS5hZGQucGh5c2ljc0dyb3VwKCk7XG5cbiAgICBnb2FsLmNyZWF0ZSgxOTUwLCA0MDAsICdnb2FsJyk7XG4gICAgZ2FtZS5waHlzaWNzLmFyY2FkZS5lbmFibGUoZ29hbCk7XG5cbiAgICBwbGF5QWdhaW5CdXR0b24gPSBnYW1lLmFkZC5idXR0b24oIDUwLCAzOTUwLCAncGxheUFnYWluJywgcGxheUFnYWluLCB0aGlzLCAyLCAxLCAwKTtcbiAgICBwbGF5QWdhaW5CdXR0b24uYW5jaG9yLnNldFRvKCAwLjUsIDAuNSk7XG4gICAgcGxheUFnYWluQnV0dG9uLnZpc2libGUgPSBmYWxzZTtcblxuXG4gICAgcGxhdGZvcm0uY3JlYXRlKC0xMDAsIDM5NTAsICdwbGF0Zm9ybScpO1xuICAgIHBsYXRmb3JtLmNyZWF0ZSg2NTAsIDM5NTAsICdwbGF0Zm9ybScpO1xuICAgIHBsYXRmb3JtLmNyZWF0ZSgxMzAwLCAzODUwLCAncGxhdGZvcm0nKTtcblxuICAgIHBvaW50ID0gZ2FtZS5hZGQucGh5c2ljc0dyb3VwKCk7XG5cbiAgICBwb2ludC5jcmVhdGUoNTI1LCAzNzUwLCAncG9pbnQnKTtcbiAgICBwb2ludC5jcmVhdGUoMTEwMCwgMzc1MCwgJ3BvaW50Jyk7XG5cbiAgICBnYW1lLnBoeXNpY3MuYXJjYWRlLmVuYWJsZShwb2ludCk7XG5cbiAgICAvLyBwbGF0Zm9ybS52aXNpYmxlID0gZmFsc2U7XG5cbiAgICBldmlsUGxhdGZvcm0gPSBnYW1lLmFkZC5waHlzaWNzR3JvdXAoKTtcblxuICAgIC8vIGV2aWxQbGF0Zm9ybSA9IGdhbWUuYWRkLnRpbGVTcHJpdGUoMCwgNjUwLCAyMDAwLCA1MCwgJ2V2aWxQbGF0Zm9ybScpXG4gICAgZXZpbFBsYXRmb3JtLmNyZWF0ZSgwLCA0MjAwLCAnZXZpbFBsYXRmb3JtJyk7XG4gICAgLy8gZXZpbFBsYXRmb3JtLnZpc2libGUgPSBmYWxzZTtcbiAgICBldmlsUGxhdGZvcm0uc2V0QWxsKCdib2R5LmltbW92YWJsZScsIHRydWUpO1xuXG5cbiAgICBwbGF5ZXIgPSBnYW1lLmFkZC5zcHJpdGUoMTAwLCAzNzQyLCAncGxheWVyJyk7XG4gICAgLy8gcGxheWVyID0gZ2FtZS5hZGQuc3ByaXRlKGdhbWUud29ybGQuY2VudGVyWCwgZ2FtZS53b3JsZC5jZW50ZXJZLCAncGxheWVyJyk7XG5cbiAgICBnYW1lLnBoeXNpY3MuYXJjYWRlLmVuYWJsZShwbGF5ZXIpO1xuXG4gICAgZ2FtZS53b3JsZC5zZXRCb3VuZHMoMCwgMCwgNDE4OSwgNDIwNCk7XG5cbiAgICBwbGF5ZXIuYm9keS5jb2xsaWRlV29ybGRCb3VuZHMgPSB0cnVlO1xuICAgIHBsYXllci5ib2R5LmdyYXZpdHkueSA9IDUwMDtcblxuICAgIHBsYXRmb3JtLnNldEFsbCgnYm9keS5pbW1vdmFibGUnLCB0cnVlKTtcblxuICAgIGN1cnNvcnMgPSBnYW1lLmlucHV0LmtleWJvYXJkLmNyZWF0ZUN1cnNvcktleXMoKTtcbiAgICBqdW1wQnV0dG9uID0gZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXkoUGhhc2VyLktleWJvYXJkLlNQQUNFQkFSKTtcblxuICAgIGdhbWUuY2FtZXJhLmZvbGxvdyhwbGF5ZXIsIFBoYXNlci5DYW1lcmEuRk9MTE9XX1BMQVRGT1JNRVIpO1xuXG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG5cbiAgICBnYW1lLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUocGxheWVyLCBldmlsUGxhdGZvcm0sIGRlYXRoKTtcblxuICAgIGdhbWUucGh5c2ljcy5hcmNhZGUuY29sbGlkZShwbGF5ZXIsIGdvYWwsIHdpbkdhbWUpO1xuXG4gICAgLy8gZ2FtZS5waHlzaWNzLmFyY2FkZS5jb2xsaWRlKHBsYXllciwgZXZpbFBsYXRmb3JtKTtcblxuICAgIGdhbWUucGh5c2ljcy5hcmNhZGUuY29sbGlkZShwbGF5ZXIsIHBsYXRmb3JtLCBmdW5jdGlvbiAoKSB7XG4gICAgfSk7XG5cbiAgICBnYW1lLnBoeXNpY3MuYXJjYWRlLm92ZXJsYXAocGxheWVyLCBwb2ludCwgc2NvcmVQb2ludCk7XG5cbiAgICBwbGF5ZXIuYm9keS52ZWxvY2l0eS54ID0gMDtcblxuICAgIGlmIChjdXJzb3JzLmxlZnQuaXNEb3duKVxuICAgIHtcbiAgICAgICAgcGxheWVyLmJvZHkudmVsb2NpdHkueCA9IC0yNTA7XG4gICAgfVxuICAgIGVsc2UgaWYgKGN1cnNvcnMucmlnaHQuaXNEb3duKVxuICAgIHtcbiAgICAgICAgcGxheWVyLmJvZHkudmVsb2NpdHkueCA9IDI1MDtcbiAgICB9XG5cbiAgICBpZiAoanVtcEJ1dHRvbi5pc0Rvd24gJiYgKHBsYXllci5ib2R5Lm9uRmxvb3IoKSB8fCBwbGF5ZXIuYm9keS50b3VjaGluZy5kb3duKSlcbiAgICB7XG4gICAgICAgIHBsYXllci5ib2R5LnZlbG9jaXR5LnkgPSAtNDAwO1xuICAgIH1cblxuICB9XG5cbn07XG5cbmZ1bmN0aW9uIHdpbkdhbWUgKCBwbGF5ZXIsIGdvYWwgKSB7XG4gIGdvYWwua2lsbCgpO1xuICBwbGF5ZXIua2lsbCgpO1xuICBjb25zb2xlLmxvZyhcInlvdSB3aW5cIik7XG4gIHNjb3JlICs9IDUwO1xuICBwb3N0U2NvcmUoKTtcbn1cblxuZnVuY3Rpb24gZGVhdGggKHBsYXllciwgZXZpbFBsYXRmb3JtKSB7XG4gIHBsYXlBZ2FpbkJ1dHRvbi52aXNpYmxlID0gdHJ1ZTtcbiAgcGxheUFnYWluQnV0dG9uLmNlbnRlclggPSAoZ2FtZS5jYW1lcmEueCArIDIwMCk7XG4gICAgLy8gZ2FtZS5zdGF0ZS5zdGFydCgnbWFpbk1lbnUnKTtcbiAgcGxheWVyLmJvZHkudmVsb2NpdHkueCA9IDA7ICBcbiAgcGxheWVyLmtpbGwoKTtcbiAgY29uc29sZS5sb2coXCJkZWF0aFwiKTtcbiAgcG9zdFNjb3JlKClcbiAgLnRoZW4oIGZ1bmN0aW9uIChzY29yZU9iamVjdCkge1xuICAgIGNvbnNvbGUubG9nKFwiZmluYWwgc2NvcmU6IFwiLCBzY29yZU9iamVjdCk7XG4gIH0pXG5cbn1cblxuZnVuY3Rpb24gc2NvcmVQb2ludCAocGxheWVyLCBwb2ludCkge1xuICBwb2ludC5raWxsKCk7XG4gIHNjb3JlICs9IDEwO1xufVxuXG5mdW5jdGlvbiBwb3N0U2NvcmUgKCkge1xuICBsZXQgc2NvcmVPYmplY3QgPSB7XG4gICAgc2NvcmUsIFxuICAgIHVzZXJOYW1lOiB1c2VyLmRpc3BsYXlOYW1lLnNwbGl0KFwiIFwiKVswXSxcbiAgICB1aWQ6IHVzZXIudWlkXG4gIH07XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICQuYWpheCh7XG4gICAgICB1cmw6IFwiaHR0cHM6Ly9nYW1lLWNhcHN0b25lLmZpcmViYXNlaW8uY29tL3Njb3Jlcy5qc29uXCIsXG4gICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHNjb3JlT2JqZWN0KSxcbiAgICAgIGRhdGFUeXBlOiBcImpzb25cIlxuICAgIH0pLmRvbmUoIGZ1bmN0aW9uICggc2NvcmVJZCApIHtcbiAgICAgIHJlc29sdmUoc2NvcmVJZCk7IFxuICAgIH0pO1xuICB9KTtcbn1cblxuZ2FtZS5zdGF0ZS5hZGQoJ21haW5TdGF0ZScsIG1haW5TdGF0ZSk7XG5cbmdhbWUuc3RhdGUuYWRkKCdtYWluTWVudScsIG1haW5NZW51KTtcbi8vIGdhbWUuc3RhdGUuYWRkKCdnYW1lT3ZlcicsIGdhbWVPdmVyKTtcblxuLy8gZ2FtZS5zdGF0ZS5zdGFydCgnbWFpblN0YXRlJyk7XG5nYW1lLnN0YXRlLnN0YXJ0KCdtYWluTWVudScpOyJdfQ==
