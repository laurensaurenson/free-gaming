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

    game.load.image('platform', "app/images/platform.png");
    game.load.image('evilPlatform', "app/images/evilPlatform.png");
    game.load.image('player', "app/images/player.png");
    game.load.image('point', "app/images/point.png");

    game.load.image('background', 'app/images/background.png');

    game.load.image('startButton', "app/images/startButton.png");
    game.load.image('goal', "app/images/goal.png");


  },


  create: function () {

    background = game.add.tileSprite(0, 0, 2000, 800, 'background');

    platform = game.add.physicsGroup();

    goal = game.add.physicsGroup();

    goal.create(1950, 400, 'goal');
    game.physics.arcade.enable(goal);

    playAgainButton = game.add.button(game.world.centerX - 95, 400, 'startButton', playAgain, this, 2, 1, 0);
    playAgainButton.visible = false;


    platform.create(0, 450, 'platform');
    platform.create(150, 300, 'platform');
    platform.create(400, 450, 'platform');
    platform.create(500, 200, 'platform');
    platform.create(600, 400, 'platform');
    platform.create(800, 600, 'platform');
    platform.create(900, 250, 'platform');
    platform.create(1000, 450, 'platform');
    platform.create(1100, 550, 'platform');
    platform.create(1300, 350, 'platform');
    platform.create(1400, 150, 'platform');
    platform.create(1600, 550, 'platform');
    platform.create(1800, 250, 'platform');
    platform.create(1900, 450, 'platform');

    point = game.add.physicsGroup();

    point.create(200, 250, 'point');
    point.create(425, 400, 'point');
    point.create(650, 350, 'point');
    point.create(600, 150, 'point');

    game.physics.arcade.enable(point);

    // platform.visible = false;

    evilPlatform = game.add.physicsGroup();

    // evilPlatform = game.add.tileSprite(0, 650, 2000, 50, 'evilPlatform')
    evilPlatform.create(0, 650, 'evilPlatform');
    // evilPlatform.visible = false;
    evilPlatform.setAll('body.immovable', true);


    player = game.add.sprite(100, 100, 'player');
    // player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');

    game.physics.arcade.enable(player);

    game.world.setBounds(0, 0, 2000, 700);

    player.body.collideWorldBounds = true;
    player.body.gravity.y = 500;

    platform.setAll('body.immovable', true);

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    game.camera.follow(player);

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
  console.log("playAgainButton", playAgainButton);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9hcHAvZ2FtZS9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGdhbWUgPSBuZXcgUGhhc2VyLkdhbWUoODAwLCA2MDAsIFBoYXNlci5BVVRPLCAnZ2FtZURpdicpO1xuXG52YXIgcGxheWVyO1xudmFyIHBsYXRmb3JtO1xudmFyIGJhY2tncm91bmQ7XG52YXIgZXZpbFBsYXRmb3JtO1xudmFyIHBvaW50OyAgXG52YXIgZ29hbDtcblxudmFyIHNjb3JlID0gMDtcblxudmFyIHN0YXJ0VGV4dDtcbnZhciBzdGFydEJ1dHRvbjtcbnZhciBpbnB1dDtcbnZhciBidXR0b247XG5cbnZhciBjdXJzb3JzO1xudmFyIGp1bXBCdXR0b247XG52YXIgbG9naW5UZXh0O1xuXG52YXIgdXNlciA9IGZpcmViYXNlLmF1dGgoKS5jdXJyZW50VXNlcjtcblxudmFyIG1haW5NZW51ID0ge1xuXG4gIHByZWxvYWQ6IGZ1bmN0aW9uICgpIHtcblxuICAgIC8vIGdhbWUuYWRkLnBsdWdpbihGYWJyaXF1ZS5QbHVnaW5zLklucHV0RmllbGQpO1xuICAgIGdhbWUubG9hZC5pbWFnZSgnc3RhcnRCdXR0b24nLCBcImFwcC9pbWFnZXMvc3RhcnRCdXR0b24ucG5nXCIpO1xuXG4gIH0sXG5cbiAgY3JlYXRlOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAvLyBpbnB1dCA9IGdhbWUuYWRkLmlucHV0RmllbGQoMzAsIDkwKTtcbiAgICBidXR0b24gPSBnYW1lLmFkZC5idXR0b24oZ2FtZS53b3JsZC5jZW50ZXJYIC0gOTUsIDQwMCwgJ3N0YXJ0QnV0dG9uJywgc3RhcnRHYW1lLCB0aGlzLCAyLCAxLCAwKTtcblxuICAgIC8vIHN0YXJ0VGV4dCA9IGdhbWUuYWRkLnRleHQoZ2FtZS53b3JsZC5jZW50ZXJYLCBnYW1lLndvcmxkLmNlbnRlclksICdTdGFydCcsIHtmb250OiAnMzJweCBBcmlhbCcsIGZpbGw6ICcjZmZmJ30pO1xuICAgIGxvZ2luVGV4dCA9IGdhbWUuYWRkLnRleHQoZ2FtZS53b3JsZC5jZW50ZXJYLCBnYW1lLndvcmxkLmNlbnRlclksICdQbGVhc2UgTG9naW4gdG8gQ29udGludWUnLCB7Zm9udDogJzMycHggQXJpYWwnLCBmaWxsOiAnI2ZmZid9KTtcbiAgICBsb2dpblRleHQudmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgLy8gc3RhcnRUZXh0Lm9uSW5wdXRVcC5hZGQoc3RhcnRHYW1lLCB0aGlzKTtcbiAgICAvLyBidXR0b24ub25JbnB1dFVwLmFkZChzdGFydEdhbWUsIHRoaXMpO1xuXG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG5cbiAgfVxuXG59O1xuXG52YXIgcmVzdGFydEJ1dHRvbjtcblxuXG5cbmZ1bmN0aW9uIHN0YXJ0R2FtZSAoKSB7XG4gIC8vIGNvbnNvbGUubG9nKFwic3RhcnRcIiwgaW5wdXQudmFsdWUpO1xuICBpZiAoIXVzZXIpIHtcbiAgICBsb2dpblRleHQudmlzaWJsZSA9IHRydWU7XG4gICAgcmV0dXJuO1xuICB9XG4gIGdhbWUuc3RhdGUuc3RhcnQoJ21haW5TdGF0ZScpO1xufVxuXG52YXIgZ2FtZU92ZXIgPSB7XG5cbiAgcHJlbG9hZDogZnVuY3Rpb24gKCkge1xuICAgIGdhbWUubG9hZC5pbWFnZSgnc3RhcnRCdXR0b24nLCBcImFwcC9pbWFnZXMvc3RhcnRCdXR0b24ucG5nXCIpO1xuXG4gIH0sXG5cbiAgY3JlYXRlOiBmdW5jdGlvbiAoKSB7XG5cbiAgICByZXN0YXJ0QnV0dG9uID0gZ2FtZS5hZGQuYnV0dG9uKGdhbWUud29ybGQuY2VudGVyWCAtIDk1LCA0MDAsICdzdGFydEJ1dHRvbicsIHBsYXlBZ2FpbiwgdGhpcywgMiwgMSwgMCk7XG5cbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcblxuICB9XG5cbn07XG5cbmZ1bmN0aW9uIHBsYXlBZ2FpbiAoKSB7XG4gIGdhbWUuc3RhdGUuc3RhcnQoJ21haW5TdGF0ZScpO1xuICAvLyBjb25zb2xlLmxvZyhcInBsYXkgYWdhaW5cIiApO1xuXG59XG5cbnZhciBwbGF5QWdhaW5CdXR0b247XG5cbnZhciBtYWluU3RhdGUgPSB7XG5cbiAgcHJlbG9hZDogZnVuY3Rpb24gKCkge1xuXG4gICAgZ2FtZS5sb2FkLmltYWdlKCdwbGF0Zm9ybScsIFwiYXBwL2ltYWdlcy9wbGF0Zm9ybS5wbmdcIik7XG4gICAgZ2FtZS5sb2FkLmltYWdlKCdldmlsUGxhdGZvcm0nLCBcImFwcC9pbWFnZXMvZXZpbFBsYXRmb3JtLnBuZ1wiKTtcbiAgICBnYW1lLmxvYWQuaW1hZ2UoJ3BsYXllcicsIFwiYXBwL2ltYWdlcy9wbGF5ZXIucG5nXCIpO1xuICAgIGdhbWUubG9hZC5pbWFnZSgncG9pbnQnLCBcImFwcC9pbWFnZXMvcG9pbnQucG5nXCIpO1xuXG4gICAgZ2FtZS5sb2FkLmltYWdlKCdiYWNrZ3JvdW5kJywgJ2FwcC9pbWFnZXMvYmFja2dyb3VuZC5wbmcnKTtcblxuICAgIGdhbWUubG9hZC5pbWFnZSgnc3RhcnRCdXR0b24nLCBcImFwcC9pbWFnZXMvc3RhcnRCdXR0b24ucG5nXCIpO1xuICAgIGdhbWUubG9hZC5pbWFnZSgnZ29hbCcsIFwiYXBwL2ltYWdlcy9nb2FsLnBuZ1wiKTtcblxuXG4gIH0sXG5cblxuICBjcmVhdGU6IGZ1bmN0aW9uICgpIHtcblxuICAgIGJhY2tncm91bmQgPSBnYW1lLmFkZC50aWxlU3ByaXRlKDAsIDAsIDIwMDAsIDgwMCwgJ2JhY2tncm91bmQnKTtcblxuICAgIHBsYXRmb3JtID0gZ2FtZS5hZGQucGh5c2ljc0dyb3VwKCk7XG5cbiAgICBnb2FsID0gZ2FtZS5hZGQucGh5c2ljc0dyb3VwKCk7XG5cbiAgICBnb2FsLmNyZWF0ZSgxOTUwLCA0MDAsICdnb2FsJyk7XG4gICAgZ2FtZS5waHlzaWNzLmFyY2FkZS5lbmFibGUoZ29hbCk7XG5cbiAgICBwbGF5QWdhaW5CdXR0b24gPSBnYW1lLmFkZC5idXR0b24oZ2FtZS53b3JsZC5jZW50ZXJYIC0gOTUsIDQwMCwgJ3N0YXJ0QnV0dG9uJywgcGxheUFnYWluLCB0aGlzLCAyLCAxLCAwKTtcbiAgICBwbGF5QWdhaW5CdXR0b24udmlzaWJsZSA9IGZhbHNlO1xuXG5cbiAgICBwbGF0Zm9ybS5jcmVhdGUoMCwgNDUwLCAncGxhdGZvcm0nKTtcbiAgICBwbGF0Zm9ybS5jcmVhdGUoMTUwLCAzMDAsICdwbGF0Zm9ybScpO1xuICAgIHBsYXRmb3JtLmNyZWF0ZSg0MDAsIDQ1MCwgJ3BsYXRmb3JtJyk7XG4gICAgcGxhdGZvcm0uY3JlYXRlKDUwMCwgMjAwLCAncGxhdGZvcm0nKTtcbiAgICBwbGF0Zm9ybS5jcmVhdGUoNjAwLCA0MDAsICdwbGF0Zm9ybScpO1xuICAgIHBsYXRmb3JtLmNyZWF0ZSg4MDAsIDYwMCwgJ3BsYXRmb3JtJyk7XG4gICAgcGxhdGZvcm0uY3JlYXRlKDkwMCwgMjUwLCAncGxhdGZvcm0nKTtcbiAgICBwbGF0Zm9ybS5jcmVhdGUoMTAwMCwgNDUwLCAncGxhdGZvcm0nKTtcbiAgICBwbGF0Zm9ybS5jcmVhdGUoMTEwMCwgNTUwLCAncGxhdGZvcm0nKTtcbiAgICBwbGF0Zm9ybS5jcmVhdGUoMTMwMCwgMzUwLCAncGxhdGZvcm0nKTtcbiAgICBwbGF0Zm9ybS5jcmVhdGUoMTQwMCwgMTUwLCAncGxhdGZvcm0nKTtcbiAgICBwbGF0Zm9ybS5jcmVhdGUoMTYwMCwgNTUwLCAncGxhdGZvcm0nKTtcbiAgICBwbGF0Zm9ybS5jcmVhdGUoMTgwMCwgMjUwLCAncGxhdGZvcm0nKTtcbiAgICBwbGF0Zm9ybS5jcmVhdGUoMTkwMCwgNDUwLCAncGxhdGZvcm0nKTtcblxuICAgIHBvaW50ID0gZ2FtZS5hZGQucGh5c2ljc0dyb3VwKCk7XG5cbiAgICBwb2ludC5jcmVhdGUoMjAwLCAyNTAsICdwb2ludCcpO1xuICAgIHBvaW50LmNyZWF0ZSg0MjUsIDQwMCwgJ3BvaW50Jyk7XG4gICAgcG9pbnQuY3JlYXRlKDY1MCwgMzUwLCAncG9pbnQnKTtcbiAgICBwb2ludC5jcmVhdGUoNjAwLCAxNTAsICdwb2ludCcpO1xuXG4gICAgZ2FtZS5waHlzaWNzLmFyY2FkZS5lbmFibGUocG9pbnQpO1xuXG4gICAgLy8gcGxhdGZvcm0udmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgZXZpbFBsYXRmb3JtID0gZ2FtZS5hZGQucGh5c2ljc0dyb3VwKCk7XG5cbiAgICAvLyBldmlsUGxhdGZvcm0gPSBnYW1lLmFkZC50aWxlU3ByaXRlKDAsIDY1MCwgMjAwMCwgNTAsICdldmlsUGxhdGZvcm0nKVxuICAgIGV2aWxQbGF0Zm9ybS5jcmVhdGUoMCwgNjUwLCAnZXZpbFBsYXRmb3JtJyk7XG4gICAgLy8gZXZpbFBsYXRmb3JtLnZpc2libGUgPSBmYWxzZTtcbiAgICBldmlsUGxhdGZvcm0uc2V0QWxsKCdib2R5LmltbW92YWJsZScsIHRydWUpO1xuXG5cbiAgICBwbGF5ZXIgPSBnYW1lLmFkZC5zcHJpdGUoMTAwLCAxMDAsICdwbGF5ZXInKTtcbiAgICAvLyBwbGF5ZXIgPSBnYW1lLmFkZC5zcHJpdGUoZ2FtZS53b3JsZC5jZW50ZXJYLCBnYW1lLndvcmxkLmNlbnRlclksICdwbGF5ZXInKTtcblxuICAgIGdhbWUucGh5c2ljcy5hcmNhZGUuZW5hYmxlKHBsYXllcik7XG5cbiAgICBnYW1lLndvcmxkLnNldEJvdW5kcygwLCAwLCAyMDAwLCA3MDApO1xuXG4gICAgcGxheWVyLmJvZHkuY29sbGlkZVdvcmxkQm91bmRzID0gdHJ1ZTtcbiAgICBwbGF5ZXIuYm9keS5ncmF2aXR5LnkgPSA1MDA7XG5cbiAgICBwbGF0Zm9ybS5zZXRBbGwoJ2JvZHkuaW1tb3ZhYmxlJywgdHJ1ZSk7XG5cbiAgICBjdXJzb3JzID0gZ2FtZS5pbnB1dC5rZXlib2FyZC5jcmVhdGVDdXJzb3JLZXlzKCk7XG4gICAganVtcEJ1dHRvbiA9IGdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5TUEFDRUJBUik7XG5cbiAgICBnYW1lLmNhbWVyYS5mb2xsb3cocGxheWVyKTtcblxuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuXG4gICAgZ2FtZS5waHlzaWNzLmFyY2FkZS5jb2xsaWRlKHBsYXllciwgZXZpbFBsYXRmb3JtLCBkZWF0aCk7XG5cbiAgICBnYW1lLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUocGxheWVyLCBnb2FsLCB3aW5HYW1lKTtcblxuICAgIC8vIGdhbWUucGh5c2ljcy5hcmNhZGUuY29sbGlkZShwbGF5ZXIsIGV2aWxQbGF0Zm9ybSk7XG5cbiAgICBnYW1lLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUocGxheWVyLCBwbGF0Zm9ybSwgZnVuY3Rpb24gKCkge1xuICAgIH0pO1xuXG4gICAgZ2FtZS5waHlzaWNzLmFyY2FkZS5vdmVybGFwKHBsYXllciwgcG9pbnQsIHNjb3JlUG9pbnQpO1xuXG4gICAgcGxheWVyLmJvZHkudmVsb2NpdHkueCA9IDA7XG5cbiAgICBpZiAoY3Vyc29ycy5sZWZ0LmlzRG93bilcbiAgICB7XG4gICAgICAgIHBsYXllci5ib2R5LnZlbG9jaXR5LnggPSAtMjUwO1xuICAgIH1cbiAgICBlbHNlIGlmIChjdXJzb3JzLnJpZ2h0LmlzRG93bilcbiAgICB7XG4gICAgICAgIHBsYXllci5ib2R5LnZlbG9jaXR5LnggPSAyNTA7XG4gICAgfVxuXG4gICAgaWYgKGp1bXBCdXR0b24uaXNEb3duICYmIChwbGF5ZXIuYm9keS5vbkZsb29yKCkgfHwgcGxheWVyLmJvZHkudG91Y2hpbmcuZG93bikpXG4gICAge1xuICAgICAgICBwbGF5ZXIuYm9keS52ZWxvY2l0eS55ID0gLTQwMDtcbiAgICB9XG5cbiAgfVxuXG59O1xuXG5mdW5jdGlvbiB3aW5HYW1lICggcGxheWVyLCBnb2FsICkge1xuICBnb2FsLmtpbGwoKTtcbiAgcGxheWVyLmtpbGwoKTtcbiAgY29uc29sZS5sb2coXCJ5b3Ugd2luXCIpO1xuICBzY29yZSArPSA1MDtcbiAgcG9zdFNjb3JlKCk7XG59XG5cbmZ1bmN0aW9uIGRlYXRoIChwbGF5ZXIsIGV2aWxQbGF0Zm9ybSkge1xuICBjb25zb2xlLmxvZyhcInBsYXlBZ2FpbkJ1dHRvblwiLCBwbGF5QWdhaW5CdXR0b24pO1xuICBwbGF5QWdhaW5CdXR0b24udmlzaWJsZSA9IHRydWU7XG4gIHBsYXlBZ2FpbkJ1dHRvbi5jZW50ZXJYID0gKGdhbWUuY2FtZXJhLnggKyAyMDApO1xuICAgIC8vIGdhbWUuc3RhdGUuc3RhcnQoJ21haW5NZW51Jyk7XG4gIHBsYXllci5ib2R5LnZlbG9jaXR5LnggPSAwOyAgXG4gIHBsYXllci5raWxsKCk7XG4gIGNvbnNvbGUubG9nKFwiZGVhdGhcIik7XG4gIHBvc3RTY29yZSgpXG4gIC50aGVuKCBmdW5jdGlvbiAoc2NvcmVPYmplY3QpIHtcbiAgICBjb25zb2xlLmxvZyhcImZpbmFsIHNjb3JlOiBcIiwgc2NvcmVPYmplY3QpO1xuICB9KVxuXG59XG5cbmZ1bmN0aW9uIHNjb3JlUG9pbnQgKHBsYXllciwgcG9pbnQpIHtcbiAgcG9pbnQua2lsbCgpO1xuICBzY29yZSArPSAxMDtcbn1cblxuZnVuY3Rpb24gcG9zdFNjb3JlICgpIHtcbiAgbGV0IHNjb3JlT2JqZWN0ID0ge1xuICAgIHNjb3JlLCBcbiAgICB1c2VyTmFtZTogdXNlci5kaXNwbGF5TmFtZS5zcGxpdChcIiBcIilbMF0sXG4gICAgdWlkOiB1c2VyLnVpZFxuICB9O1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiBcImh0dHBzOi8vZ2FtZS1jYXBzdG9uZS5maXJlYmFzZWlvLmNvbS9zY29yZXMuanNvblwiLFxuICAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShzY29yZU9iamVjdCksXG4gICAgICBkYXRhVHlwZTogXCJqc29uXCJcbiAgICB9KS5kb25lKCBmdW5jdGlvbiAoIHNjb3JlSWQgKSB7XG4gICAgICByZXNvbHZlKHNjb3JlSWQpOyBcbiAgICB9KTtcbiAgfSk7XG59XG5cbmdhbWUuc3RhdGUuYWRkKCdtYWluU3RhdGUnLCBtYWluU3RhdGUpO1xuXG5nYW1lLnN0YXRlLmFkZCgnbWFpbk1lbnUnLCBtYWluTWVudSk7XG4vLyBnYW1lLnN0YXRlLmFkZCgnZ2FtZU92ZXInLCBnYW1lT3Zlcik7XG5cbi8vIGdhbWUuc3RhdGUuc3RhcnQoJ21haW5TdGF0ZScpO1xuZ2FtZS5zdGF0ZS5zdGFydCgnbWFpbk1lbnUnKTsiXX0=
