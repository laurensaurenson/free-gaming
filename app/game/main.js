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