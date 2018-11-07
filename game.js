// ctx is from the canvas API
var canvas = document.getElementById('game');
var ctx = canvas.getContext("2d");

document.getElementById('game').style.backgroundImage = "url('images/background.png')";

//background.src = 'images/background.png';
// renders a new image
var ship = new Image();

var posX = canvas.width/2;
var posY = canvas.height - 50;

ship.onload = function() {
  ctx.drawImage(ship, posX, posY);
};

ship.src = 'images/ship.png';

var asteroids = [];
var count = 0;
var asteroidSpeed = 2.5;
var speedIncrease = 1.03;
var noLaser = true;

var lastUpdate = 0;
var playerDirection = 0;

var laser = {
  image: new Image(),
  x: -50,
  y: 0
}

laser.image.onload = function() {
  ctx.drawImage(laser.image, laser.x, laser.y);
};

laser.image.src = 'images/laser.png';

var score = 0;

// functions from the canvas API that restore the canvas to a default state
function Player()
{
    ctx.restore();
    ctx.drawImage(ship,posX,posY);
}

// on the keydown event - if the key that caused this event (e) is 68 - or the letter 'd' - do something
addEventListener("keydown",function(e)
{
    if(e.keyCode == 39) {
      playerDirection = 10;
    } else if (e.keyCode == 37) {
      playerDirection = -10;
    } else if (e.keyCode == 32 && noLaser) {
      fireLaser();
    }
});

addEventListener("keyup",function(e)
{
    playerDirection = 0;
});

// this line cause a function (Tick) to be performed every 16 milliseconds
var current = setInterval(Tick,16);

function Tick()
{
// these 3 lines keep the flow of the game moving - they may not be necessary for you
    var now = Date.now();
    var dt = now - lastUpdate;
    lastUpdate = now;
// update checks the game conditions and changes them as necessary
    Update(dt);
//render redraws what it needs to draw based upon the games conditions
    Render(dt);
}

function Update(dt) {
  posX += playerDirection;
  count++;
  if (count == 5) {
    createAsteroid(Math.random()*1170);
    count = 0;
  }

  for (var i = 0; i < asteroids.length; i++) {
    asteroids[i].y += asteroidSpeed;
    if (asteroids[i].y > canvas.height) {
      asteroids.splice(i, 1);
    }

    if (asteroids[i].x > posX - 24 && asteroids[i].x < posX + 24 && asteroids[i].y > posY - 24 && asteroids[i].y < posY + 24 ) {
      if (document.getElementById('highscore').value < score) {
        document.getElementById('highscore').value = score;
      }
      score = 0;
      asteroidSpeed = 3;
      asteroids = [];
      document.getElementById('score').value = score;
    }

    if (asteroids[i].x > laser.x - 32 && asteroids[i].x < laser.x + 4 && asteroids[i].y > laser.y - 24 && asteroids[i].y < laser.y + 24) {
      asteroids.splice(i, 1);
      score += 10;
      noLaser = true;
      if (score >= 50) {
        asteroidSpeed *= speedIncrease;
      }
      document.getElementById('score').value = score;

      laser.x = -50;
    }
  }

  laser.y -= 10;
  if (laser.y < 0) {
    noLaser = true;
  }
}

function Render(dt) {
  ctx.clearRect(0, 0 ,canvas.width, canvas.height);
  if (posX < 0) {
    posX = 0;
  } else if (posX > 1170) {
    posX = 1170;
  }

  ctx.drawImage(ship,posX,posY);
  for (var i = 0; i < asteroids.length; i++) {
    ctx.drawImage(asteroids[i].image, asteroids[i].x, asteroids[i].y);
  }


  ctx.drawImage(laser.image, laser.x, laser.y);


}

function createAsteroid(x) {
  asteroid = {
    image: new Image(),
    x: x,
    y:0
  };
  asteroid.image.onload = function() {
    ctx.drawImage(asteroid.image, x, 0);
  };
  asteroid.image.src = 'images/asteroid.png';

  asteroids.push(asteroid);
}

function fireLaser() {
    laser.x = posX + 11;
    laser.y = posY - 30;
    noLaser = false;
}
