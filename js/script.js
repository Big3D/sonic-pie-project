//adds click event listener to the start button
document.getElementById("start-button").addEventListener("click", startGame);
const Menu_Canvas = document.getElementById("menu_canvas");
let mtx = Menu_Canvas.getContext("2d");
let start_button = document.getElementById("start-button");
let leaderboard_button = document.getElementById("leaderboard-button");
leaderBoardMenu.style.display = "none";
Menu_Canvas.width = innerWidth;
Menu_Canvas.height = innerHeight;
const image1 = new Image();
// image1.src = "../img/sonic.img";
image1.addEventListener("load", function () {
  mtx.drawImage(image1, 0, 0, Menu_Canvas.width, Menu_Canvas.width);
});
start_button.addEventListener("click", function () {
  start_button.style.display = "none";
  leaderboard_button.style.display = "none";
  // leaderBoardMenu.style.display = "block";
  leaderBoardMenu.style.display = "none";

  //logo square
  mtx.beginPath();
  mtx.lineWidth = "2";
  mtx.rect(100, 20, 500, 100);
  mtx.stroke();

  //start button
  mtx.beginPath();
  mtx.lineWidth = "2";

  mtx.rect(100, 400, 50, 25);
  mtx.stroke();

  //leaderboard button
  mtx.beginPath();
  mtx.lineWidth = "2";
  mtx.rect(516, 400, 84, 25);
  mtx.stroke();

  // const MainLogo_Canvas = document.getElementById("main_logo");
  // let mLtx = Menu_Canvas.getContext("2d");
  // mLtx.moveTo(0, 0);
  // mLtx.lineTo(0, 0);
  // mLtx.stroke();

  // // Btn Canvas Design
  // const Btn_Canvas = document.getElementById("btn_play");
  // let btx = Btn_Canvas.getContext("2d");
  // btx.beginPath();
  // btx.arc(5, 5, 40, 0, 2 * Math.PI);
  // btx.stroke()

  // Character movement
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  // gravity
  const gravity = 0.5;
  //SCORE
  let score = 0;


  const playerSprite1 = new Image();
  playerSprite1.src = "/img/TEST-Catwalk copy.png";

  // player class
  class Player {
    constructor() {
      this.position = {
        x: 100,
        y: 100,
      };
      this.velocity = {
        x: 0,
        y: 0,
      };
      // size of player

      this.width = 160;
      this.height = 120;
      this.image = playerSprite1

    }

    // render player
    draw() {

      // ctx.fillStyle = "blue";
      // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
      mtx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);

    }

    update() {
      this.draw();
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;

      // makes player position always hit the ground of the canvas
      if (this.position.y + this.height + this.velocity.y <= canvas.height)
        this.velocity.y += gravity;
      else {
        this.velocity.y = 0;
      }
    }
  }

  // CLASS CONTRUCTOR FOR PLATFORMS
  class Platform {
    constructor({ x, y }) {
      this.position = {
        x,
        y

      }
      this.width = 200
      this.height = 35
    }
    draw() {
      ctx.fillStyle = 'purple'
      ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
  }

  // obstacle class
  class Obstacle {
    constructor({ position, velocity, distance }) {
      this.position = {
        x: position.x,
        y: position.y,
      };
      this.velocity = {
        x: velocity.x,
        y: velocity.y,
      };
      this.width = 30;
      this.height = 30;

      this.distance = distance;
    }

    draw() {
      ctx.fillStyle = "red";
      ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
      this.draw();
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;


      // sets obstacle "y" position to bottom of canvas
      if (this.position.y + this.height + this.velocity.y <= canvas.height) {
        this.velocity.y += gravity;
      } else {
        this.velocity.y = 0;
      }


      // makes obstacle go back and forth
      this.distance.traveled += Math.abs(this.velocity.x);

      if (this.distance.traveled > this.distance.limit) {
        this.distance.traveled = 0;
        this.velocity.x = -this.velocity.x;
      }
    }
  }


  // new instance - sonic
  const sonic = new Player();

  //new instance Platforms
  const platforms = [new Platform({ x: 300, y: 550 }), new Platform({ x: 500, y: 450 })]


  // health bar
  let health = 100;

  // new moving obstacles
  let obstacles = [];

  obstacles = [
    new Obstacle({
      position: {
        x: 400,
        y: 400,
      },
      velocity: {
        x: -0.5,
        y: 0,
      },
      distance: {
        limit: 100,
        traveled: 0,
      },
    }),
    new Obstacle({
      position: {
        x: 800,
        y: 400,
      },
      velocity: {
        x: -0.5,
        y: 0,
      },
      distance: {
        limit: 100,
        traveled: 0,
      },
    }),
  ];

  const keys = {
    right: {
      pressed: false,
    },
    left: {
      pressed: false,
    },
    spacebar: {
      pressed: false,
    },
  };

  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //loops through platforms arrray
    platforms.forEach((platform) => { platform.draw() })
    //platform collision 
    platforms.forEach((platform) => {
      if (sonic.position.y + sonic.height <= platform.position.y
        && sonic.position.y + sonic.height + sonic.velocity.y >= platform.position.y
        && sonic.position.x + sonic.width >= platform.position.x
        && sonic.position.x <= platform.position.x + platform.width
      ) {
        sonic.velocity.y = 0
      }
    })

    // updates each obstacle in the array
    obstacles.forEach((obstacle) => {
      // detects for collision between obstacle and player
      if (
        sonic.position.x + sonic.width >= obstacle.position.x &&
        sonic.position.x <= obstacle.position.x + obstacle.width &&
        sonic.position.y + sonic.height >= obstacle.position.y &&
        sonic.position.y <= obstacle.position.y + obstacle.height
      ) {
        // damage - restart game when player has no lives left
        if (health < 0) {
          startGame();
        } else {
          // decrements health and pushes player back slightly
          health--;
          sonic.position.y -= 50;
          sonic.position.x -= 150;
        }
        // for testing purposes only
        console.log(health);
      }
      obstacle.update();
    });

    // updates player
    sonic.update();

    if (keys.right.pressed) {
      sonic.velocity.x = 5;
      // SHOW SCORE 
      score = (sonic.position.x / 2)
      if (score === 100) {
        document.getElementById('currentScore').innerHTML = `Score: ${score}`
      }
      if (score === 300) {
        document.getElementById('currentScore').innerHTML = `Score: ${score}`
      }
      if (score === 500) {
        document.getElementById('currentScore').innerHTML = `Score: ${score}`
      }
    } else if (keys.left.pressed) {
      sonic.velocity.x = -5;
    } else {
      sonic.velocity.x = 0;
    }
  }

  animate();

  // character movement on keydown
  addEventListener("keydown", ({ keyCode }) => {
    switch (keyCode) {
      case 37:
        keys.left.pressed = true;
        break;
      case 39:
        keys.right.pressed = true;
        break;
      case 32:
        if(!keys.spacebar.pressed){
          keys.spacebar.pressed = true
          sonic.velocity.y -= 15;
        }
        break;
    }
  });

  // character movement on key up
  addEventListener("keyup", ({ keyCode }) => {
    switch (keyCode) {
      case 37:
        keys.left.pressed = false;
        break;
      case 39:
        keys.right.pressed = false;
        break;
      case 32:
        keys.spacebar.pressed = false
        if(!keys.spacebar.pressed && sonic.velocity.y != 0){
          sonic.velocity.y += 14
          
        }
        break;
    }
  });

  // Timer
});

let i = 60; 
let timeout; 
let stopTime = -1;

function onTimer() {
  document.getElementById("countdown").innerHTML = i;
  i--;
  timeout = setTimeout(onTimer, 1000);
  if (i <= stopTime) {
    clearTimeout(timeout);
    setTimeout(() => window.open('http://127.0.0.1:5505/game%20over.html'), 1000);
    };
  }

//function that will start the canvas game
function startGame() {
  console.log("start");
}

//// Title page ////

const titleBG = new Image();
titleBG.src = "/img/Background-img/TitleBG1.png";
const titleLogo = new Image();
titleLogo.src = "/img/UI/Logo notfinal.png";

class TitleBackground {
  constructor({ x, y, titleImage }) {
    this.position = { x, y };

    this.image = titleImage;
    this.width = 1920;
    this.height = 1080;
    console.log(this.image);
  }

  draw() {
    mtx.drawImage(this.image, this.position.x, this.position.y);
  }
}
class TitleLogo {
  constructor({ x, y, logoImage }) {
    this.position = { x, y };

    this.image = logoImage;
    this.width = 200;
    this.height = 200;
  }

  draw() {
    mtx.drawImage(this.image, this.position.x, this.position.y);
  }
}

let titleImage = new Image();
titleImage = titleBG;
const titleScreen = new TitleBackground({ x: 0, y: -10, titleImage });
let logoImage = new Image();
logoImage = titleLogo;
const titleLogoBig = new TitleLogo({
  x: Menu_Canvas.width / 2 - logoImage.width / 2.1,
  y: 10,
  logoImage,
});

// Loads the title image
titleImage.onload = function () {
  titleScreen.draw();
};
logoImage.onload = function () {
  titleLogoBig.draw();

};

