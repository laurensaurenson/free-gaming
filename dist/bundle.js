(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv');

var player;
var platform;
var background;
var evilPlatform;
var point;  

var score = 0;

var startText;
var startButton;
var input;
var button;

var cursors;
var jumpButton;

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

    // startText.onInputUp.add(startGame, this);
    // button.onInputUp.add(startGame, this);

  },

  update: function () {

  }

};

function startGame () {
  // console.log("start", input.value);
  if (!user) {
    console.log("login");
    return
  }
  game.state.start('mainState');
  console.log("user: ", user);
  console.log("user name: ", user.displayName.split(" ")[0]);
}


var mainState = {

  preload: function () {

    game.load.image('platform', "app/images/platform.png");
    game.load.image('evilPlatform', "app/images/evilPlatform.png");
    game.load.image('player', "app/images/player.png");
    game.load.image('point', "app/images/point.png");

    game.load.image('background', 'app/images/background.png');

  },

  create: function () {

    background = game.add.tileSprite(0, 0, 2000, 800, 'background');

    platform = game.add.physicsGroup();

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

    point.create(0, 400, 'point');
    point.create(250, 300, 'point');
    point.create(342, 200, 'point');
    point.create(463, 300, 'point');

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

    // game.physics.arcade.collide(player, evilPlatform);

    game.physics.arcade.collide(player, platform, function () {
      console.log("touch");
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

function death (player, evilPlatform) {
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
  console.log("score", score);
}

function postScore () {
  let scoreObject = {
    score, 
    userName: user.displayName.split(" ")[0],
    user: user.uid
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

// game.state.start('mainState');
game.state.start('mainMenu');
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9hcHAvZ2FtZS9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZ2FtZSA9IG5ldyBQaGFzZXIuR2FtZSg4MDAsIDYwMCwgUGhhc2VyLkFVVE8sICdnYW1lRGl2Jyk7XG5cbnZhciBwbGF5ZXI7XG52YXIgcGxhdGZvcm07XG52YXIgYmFja2dyb3VuZDtcbnZhciBldmlsUGxhdGZvcm07XG52YXIgcG9pbnQ7ICBcblxudmFyIHNjb3JlID0gMDtcblxudmFyIHN0YXJ0VGV4dDtcbnZhciBzdGFydEJ1dHRvbjtcbnZhciBpbnB1dDtcbnZhciBidXR0b247XG5cbnZhciBjdXJzb3JzO1xudmFyIGp1bXBCdXR0b247XG5cbnZhciB1c2VyID0gZmlyZWJhc2UuYXV0aCgpLmN1cnJlbnRVc2VyO1xuXG52YXIgbWFpbk1lbnUgPSB7XG5cbiAgcHJlbG9hZDogZnVuY3Rpb24gKCkge1xuXG4gICAgLy8gZ2FtZS5hZGQucGx1Z2luKEZhYnJpcXVlLlBsdWdpbnMuSW5wdXRGaWVsZCk7XG4gICAgZ2FtZS5sb2FkLmltYWdlKCdzdGFydEJ1dHRvbicsIFwiYXBwL2ltYWdlcy9zdGFydEJ1dHRvbi5wbmdcIik7XG5cbiAgfSxcblxuICBjcmVhdGU6IGZ1bmN0aW9uICgpIHtcblxuICAgIC8vIGlucHV0ID0gZ2FtZS5hZGQuaW5wdXRGaWVsZCgzMCwgOTApO1xuICAgIGJ1dHRvbiA9IGdhbWUuYWRkLmJ1dHRvbihnYW1lLndvcmxkLmNlbnRlclggLSA5NSwgNDAwLCAnc3RhcnRCdXR0b24nLCBzdGFydEdhbWUsIHRoaXMsIDIsIDEsIDApO1xuXG4gICAgLy8gc3RhcnRUZXh0ID0gZ2FtZS5hZGQudGV4dChnYW1lLndvcmxkLmNlbnRlclgsIGdhbWUud29ybGQuY2VudGVyWSwgJ1N0YXJ0Jywge2ZvbnQ6ICczMnB4IEFyaWFsJywgZmlsbDogJyNmZmYnfSk7XG5cbiAgICAvLyBzdGFydFRleHQub25JbnB1dFVwLmFkZChzdGFydEdhbWUsIHRoaXMpO1xuICAgIC8vIGJ1dHRvbi5vbklucHV0VXAuYWRkKHN0YXJ0R2FtZSwgdGhpcyk7XG5cbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcblxuICB9XG5cbn07XG5cbmZ1bmN0aW9uIHN0YXJ0R2FtZSAoKSB7XG4gIC8vIGNvbnNvbGUubG9nKFwic3RhcnRcIiwgaW5wdXQudmFsdWUpO1xuICBpZiAoIXVzZXIpIHtcbiAgICBjb25zb2xlLmxvZyhcImxvZ2luXCIpO1xuICAgIHJldHVyblxuICB9XG4gIGdhbWUuc3RhdGUuc3RhcnQoJ21haW5TdGF0ZScpO1xuICBjb25zb2xlLmxvZyhcInVzZXI6IFwiLCB1c2VyKTtcbiAgY29uc29sZS5sb2coXCJ1c2VyIG5hbWU6IFwiLCB1c2VyLmRpc3BsYXlOYW1lLnNwbGl0KFwiIFwiKVswXSk7XG59XG5cblxudmFyIG1haW5TdGF0ZSA9IHtcblxuICBwcmVsb2FkOiBmdW5jdGlvbiAoKSB7XG5cbiAgICBnYW1lLmxvYWQuaW1hZ2UoJ3BsYXRmb3JtJywgXCJhcHAvaW1hZ2VzL3BsYXRmb3JtLnBuZ1wiKTtcbiAgICBnYW1lLmxvYWQuaW1hZ2UoJ2V2aWxQbGF0Zm9ybScsIFwiYXBwL2ltYWdlcy9ldmlsUGxhdGZvcm0ucG5nXCIpO1xuICAgIGdhbWUubG9hZC5pbWFnZSgncGxheWVyJywgXCJhcHAvaW1hZ2VzL3BsYXllci5wbmdcIik7XG4gICAgZ2FtZS5sb2FkLmltYWdlKCdwb2ludCcsIFwiYXBwL2ltYWdlcy9wb2ludC5wbmdcIik7XG5cbiAgICBnYW1lLmxvYWQuaW1hZ2UoJ2JhY2tncm91bmQnLCAnYXBwL2ltYWdlcy9iYWNrZ3JvdW5kLnBuZycpO1xuXG4gIH0sXG5cbiAgY3JlYXRlOiBmdW5jdGlvbiAoKSB7XG5cbiAgICBiYWNrZ3JvdW5kID0gZ2FtZS5hZGQudGlsZVNwcml0ZSgwLCAwLCAyMDAwLCA4MDAsICdiYWNrZ3JvdW5kJyk7XG5cbiAgICBwbGF0Zm9ybSA9IGdhbWUuYWRkLnBoeXNpY3NHcm91cCgpO1xuXG4gICAgcGxhdGZvcm0uY3JlYXRlKDAsIDQ1MCwgJ3BsYXRmb3JtJyk7XG4gICAgcGxhdGZvcm0uY3JlYXRlKDE1MCwgMzAwLCAncGxhdGZvcm0nKTtcbiAgICBwbGF0Zm9ybS5jcmVhdGUoNDAwLCA0NTAsICdwbGF0Zm9ybScpO1xuICAgIHBsYXRmb3JtLmNyZWF0ZSg1MDAsIDIwMCwgJ3BsYXRmb3JtJyk7XG4gICAgcGxhdGZvcm0uY3JlYXRlKDYwMCwgNDAwLCAncGxhdGZvcm0nKTtcbiAgICBwbGF0Zm9ybS5jcmVhdGUoODAwLCA2MDAsICdwbGF0Zm9ybScpO1xuICAgIHBsYXRmb3JtLmNyZWF0ZSg5MDAsIDI1MCwgJ3BsYXRmb3JtJyk7XG4gICAgcGxhdGZvcm0uY3JlYXRlKDEwMDAsIDQ1MCwgJ3BsYXRmb3JtJyk7XG4gICAgcGxhdGZvcm0uY3JlYXRlKDExMDAsIDU1MCwgJ3BsYXRmb3JtJyk7XG4gICAgcGxhdGZvcm0uY3JlYXRlKDEzMDAsIDM1MCwgJ3BsYXRmb3JtJyk7XG4gICAgcGxhdGZvcm0uY3JlYXRlKDE0MDAsIDE1MCwgJ3BsYXRmb3JtJyk7XG4gICAgcGxhdGZvcm0uY3JlYXRlKDE2MDAsIDU1MCwgJ3BsYXRmb3JtJyk7XG4gICAgcGxhdGZvcm0uY3JlYXRlKDE4MDAsIDI1MCwgJ3BsYXRmb3JtJyk7XG4gICAgcGxhdGZvcm0uY3JlYXRlKDE5MDAsIDQ1MCwgJ3BsYXRmb3JtJyk7XG5cbiAgICBwb2ludCA9IGdhbWUuYWRkLnBoeXNpY3NHcm91cCgpO1xuXG4gICAgcG9pbnQuY3JlYXRlKDAsIDQwMCwgJ3BvaW50Jyk7XG4gICAgcG9pbnQuY3JlYXRlKDI1MCwgMzAwLCAncG9pbnQnKTtcbiAgICBwb2ludC5jcmVhdGUoMzQyLCAyMDAsICdwb2ludCcpO1xuICAgIHBvaW50LmNyZWF0ZSg0NjMsIDMwMCwgJ3BvaW50Jyk7XG5cbiAgICBnYW1lLnBoeXNpY3MuYXJjYWRlLmVuYWJsZShwb2ludCk7XG5cbiAgICAvLyBwbGF0Zm9ybS52aXNpYmxlID0gZmFsc2U7XG5cbiAgICBldmlsUGxhdGZvcm0gPSBnYW1lLmFkZC5waHlzaWNzR3JvdXAoKTtcblxuICAgIC8vIGV2aWxQbGF0Zm9ybSA9IGdhbWUuYWRkLnRpbGVTcHJpdGUoMCwgNjUwLCAyMDAwLCA1MCwgJ2V2aWxQbGF0Zm9ybScpXG4gICAgZXZpbFBsYXRmb3JtLmNyZWF0ZSgwLCA2NTAsICdldmlsUGxhdGZvcm0nKTtcbiAgICAvLyBldmlsUGxhdGZvcm0udmlzaWJsZSA9IGZhbHNlO1xuICAgIGV2aWxQbGF0Zm9ybS5zZXRBbGwoJ2JvZHkuaW1tb3ZhYmxlJywgdHJ1ZSk7XG5cblxuICAgIHBsYXllciA9IGdhbWUuYWRkLnNwcml0ZSgxMDAsIDEwMCwgJ3BsYXllcicpO1xuICAgIC8vIHBsYXllciA9IGdhbWUuYWRkLnNwcml0ZShnYW1lLndvcmxkLmNlbnRlclgsIGdhbWUud29ybGQuY2VudGVyWSwgJ3BsYXllcicpO1xuXG4gICAgZ2FtZS5waHlzaWNzLmFyY2FkZS5lbmFibGUocGxheWVyKTtcblxuICAgIGdhbWUud29ybGQuc2V0Qm91bmRzKDAsIDAsIDIwMDAsIDcwMCk7XG5cbiAgICBwbGF5ZXIuYm9keS5jb2xsaWRlV29ybGRCb3VuZHMgPSB0cnVlO1xuICAgIHBsYXllci5ib2R5LmdyYXZpdHkueSA9IDUwMDtcblxuICAgIHBsYXRmb3JtLnNldEFsbCgnYm9keS5pbW1vdmFibGUnLCB0cnVlKTtcblxuICAgIGN1cnNvcnMgPSBnYW1lLmlucHV0LmtleWJvYXJkLmNyZWF0ZUN1cnNvcktleXMoKTtcbiAgICBqdW1wQnV0dG9uID0gZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXkoUGhhc2VyLktleWJvYXJkLlNQQUNFQkFSKTtcblxuICAgIGdhbWUuY2FtZXJhLmZvbGxvdyhwbGF5ZXIpO1xuXG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG5cbiAgICBnYW1lLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUocGxheWVyLCBldmlsUGxhdGZvcm0sIGRlYXRoKTtcblxuICAgIC8vIGdhbWUucGh5c2ljcy5hcmNhZGUuY29sbGlkZShwbGF5ZXIsIGV2aWxQbGF0Zm9ybSk7XG5cbiAgICBnYW1lLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUocGxheWVyLCBwbGF0Zm9ybSwgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc29sZS5sb2coXCJ0b3VjaFwiKTtcbiAgICB9KTtcblxuICAgIGdhbWUucGh5c2ljcy5hcmNhZGUub3ZlcmxhcChwbGF5ZXIsIHBvaW50LCBzY29yZVBvaW50KTtcblxuICAgIHBsYXllci5ib2R5LnZlbG9jaXR5LnggPSAwO1xuXG4gICAgaWYgKGN1cnNvcnMubGVmdC5pc0Rvd24pXG4gICAge1xuICAgICAgICBwbGF5ZXIuYm9keS52ZWxvY2l0eS54ID0gLTI1MDtcbiAgICB9XG4gICAgZWxzZSBpZiAoY3Vyc29ycy5yaWdodC5pc0Rvd24pXG4gICAge1xuICAgICAgICBwbGF5ZXIuYm9keS52ZWxvY2l0eS54ID0gMjUwO1xuICAgIH1cblxuICAgIGlmIChqdW1wQnV0dG9uLmlzRG93biAmJiAocGxheWVyLmJvZHkub25GbG9vcigpIHx8IHBsYXllci5ib2R5LnRvdWNoaW5nLmRvd24pKVxuICAgIHtcbiAgICAgICAgcGxheWVyLmJvZHkudmVsb2NpdHkueSA9IC00MDA7XG4gICAgfVxuXG4gIH1cblxufTtcblxuZnVuY3Rpb24gZGVhdGggKHBsYXllciwgZXZpbFBsYXRmb3JtKSB7XG4gIHBsYXllci5ib2R5LnZlbG9jaXR5LnggPSAwOyAgXG4gIHBsYXllci5raWxsKCk7XG4gIGNvbnNvbGUubG9nKFwiZGVhdGhcIik7XG4gIHBvc3RTY29yZSgpXG4gIC50aGVuKCBmdW5jdGlvbiAoc2NvcmVPYmplY3QpIHtcbiAgICBjb25zb2xlLmxvZyhcImZpbmFsIHNjb3JlOiBcIiwgc2NvcmVPYmplY3QpO1xuICB9KVxuXG59XG5cbmZ1bmN0aW9uIHNjb3JlUG9pbnQgKHBsYXllciwgcG9pbnQpIHtcbiAgcG9pbnQua2lsbCgpO1xuICBzY29yZSArPSAxMDtcbiAgY29uc29sZS5sb2coXCJzY29yZVwiLCBzY29yZSk7XG59XG5cbmZ1bmN0aW9uIHBvc3RTY29yZSAoKSB7XG4gIGxldCBzY29yZU9iamVjdCA9IHtcbiAgICBzY29yZSwgXG4gICAgdXNlck5hbWU6IHVzZXIuZGlzcGxheU5hbWUuc3BsaXQoXCIgXCIpWzBdLFxuICAgIHVzZXI6IHVzZXIudWlkXG4gIH07XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICQuYWpheCh7XG4gICAgICB1cmw6IFwiaHR0cHM6Ly9nYW1lLWNhcHN0b25lLmZpcmViYXNlaW8uY29tL3Njb3Jlcy5qc29uXCIsXG4gICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHNjb3JlT2JqZWN0KSxcbiAgICAgIGRhdGFUeXBlOiBcImpzb25cIlxuICAgIH0pLmRvbmUoIGZ1bmN0aW9uICggc2NvcmVJZCApIHtcbiAgICAgIHJlc29sdmUoc2NvcmVJZCk7IFxuICAgIH0pO1xuICB9KTtcbn1cblxuZ2FtZS5zdGF0ZS5hZGQoJ21haW5TdGF0ZScsIG1haW5TdGF0ZSk7XG5cbmdhbWUuc3RhdGUuYWRkKCdtYWluTWVudScsIG1haW5NZW51KTtcblxuLy8gZ2FtZS5zdGF0ZS5zdGFydCgnbWFpblN0YXRlJyk7XG5nYW1lLnN0YXRlLnN0YXJ0KCdtYWluTWVudScpOyJdfQ==
