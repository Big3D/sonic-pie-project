//adds click event listener to the start button
const Menu_Canvas = document.getElementById("menu_canvas");
let mtx = Menu_Canvas.getContext("2d");
let start_button = document.getElementById("start-button");
let leaderboard_button = document.getElementById("leaderboard-button");
let gameoverscreen = document.getElementById("gameover-screen");
leaderBoardMenu.style.display = "none";
Menu_Canvas.width = innerWidth;
Menu_Canvas.height = innerHeight;
let keepAnimating = true;

//// Audio Testing ////
let playing = false;

const titleBGM1 = new Audio("/audio/BGM/Title-theme1.mp3");
const GameBGM1 = new Audio("/audio/BGM/Game-BGM1.mp3");

////Set this to TRUE to stop the music reloading constantly
let mute = false;

function playBGM(){
  if (!mute && !playing) {
    titleBGM1.onload = titleBGM1.play();
    GameBGM1.pause();
  }
  else if (!mute && playing) {
    GameBGM1.onload = GameBGM1.play();
    titleBGM1.pause();
  }
  else if (mute){
    GameBGM1.pause();
    titleBGM1.pause();
  }
}

function muteUnmute() {
  if (!mute){
    console.log('Mute')
    mute = true;
    playBGM();
  }
  else if(mute){
    console.log('Unmute')
    mute = false;
    playBGM();
  }
}

playBGM();
//// Audio Testing ////

// Using Boolean to stop start countdown
let countingDown = false;
start_button.addEventListener("click", StartGame);
function StartGame() {
  if(!playing){
    playing = true;
  }

  let removeDisplay = new Promise((resolve) => {
    resolve = reduceCount();
  });
  removeDisplay.then(setTimeout(undoDisplay, 4000));

  start_button.style.display = "none";
  leaderboard_button.style.display = "none";
  gameoverscreen.style.display = "none";
  // leaderBoardMenu.style.display = "block";
  leaderBoardMenu.style.display = "none";
  animate();
}

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

//Background Images Class
class Background {
  constructor(index) {
    this.position = {
      x: 0,
      y: 0,
    };
    this.index = index;
    this.backgroundImage = new Image();
    this.backgroundImage.src = `/img/Background-img/Frame_${index + 1}.png`;
  }
  draw() {
    const offset = this.index * canvas.width;
    ctx.drawImage(
      this.backgroundImage,
      this.position.x + offset,
      this.position.y,
      canvas.width,
      canvas.height
    );
  }
}

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
    this.image = playerSprite1;
  }

  // render player
  draw() {
    // ctx.fillStyle = "blue";
    // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    mtx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
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

// platform sprite
const platformSprite = new Image();
platformSprite.src = '/img/Platform-img/Platform 03.png'

// CLASS CONTRUCTOR FOR PLATFORMS
class Platform {
	constructor({ x, y }) {
		this.position = {
			x,
			y,
		};
		this.width = 280;
		this.height = 90;
		this.platformImage = platformSprite
	}
	draw() {
		ctx.drawImage(this.platformImage,this.position.x, this.position.y, this.width, this.height)
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
//Tsi
class Pie {
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
    this.alive = true;
  }
  //Draw pie
  draw() {
    ctx.fillStyle = "green";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  clear() {
    this.alive = false;
  }
  update() {
    if (this.alive === true) {
      this.draw();
      this.position.y += this.velocity.y;
      //sets obstacle "y" position to bottom of canvas
      if (this.position.y + this.height + this.velocity.y <= canvas.height) {
        this.velocity.y += gravity;
      } else {
        this.velocity.y = 0;
      }
    }
  }
}

// end score modal class
class Modal {
  constructor() {
    this.position = {
      // ensures modal position is in the center of canvas
      x: canvas.width / 3,
      y: canvas.height / 6,
    };

    this.width = 400;
    this.height = 450;
  }

  draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.fillStyle = "black";
    ctx.font = "20pt Arial";
    ctx.textAlign = "center";
    // End score modal title heading
    ctx.fillText(`FINAL SCORE`, this.position.x * 1.55, this.position.y + 100);
    // Score from game play
    ctx.fillText(
      `Score: ${score}`,
      this.position.x * 1.55,
      this.position.y + 200
    );
    // Remaining time in game * 100
    ctx.fillText(
      `Timer Bonus = ${i} x 100`,
      this.position.x * 1.55,
      this.position.y + 250
    );
    // Totals final score (score + timer bonus)
    ctx.fillText(
      `Final Score = ${Math.floor(score + i * 100)} `,
      this.position.x * 1.55,
      this.position.y + 300
    );
  }
}

// new instance background images
let backgrounds = [];
for (let i = 0; i < 8; i++) {
  backgrounds.push(new Background(i));
}

// new instance - sonic
const sonic = new Player();

//new instance Platforms
const platforms = [

	new Platform({ x: 300, y: 450 }),
	new Platform({ x: 800, y: 300 }),
	new Platform({ x: 1300, y: 250 }),
	new Platform({ x: 2000, y: 350 }),
	new Platform({ x: 2500, y: 450 }),
	new Platform({ x: 3000, y: 350 }),
	new Platform({ x: 3500, y: 250 }),
	new Platform({ x: 4200, y: 250 }),
	new Platform({ x: 4800, y: 350 }),
	new Platform({ x: 5300, y: 350 }),
	new Platform({ x: 5700, y: 450 }),
	new Platform({ x: 6300, y: 400 }),
  
];

// new instance - end score modal
const endScoreModal = new Modal();

// health bar
let health = 100;

// new moving obstacles
let obstacles = [];
let pies = [];
// scroll position
let scrollPosition = 0;

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
// tsi
pies = [
  new Pie({
    position: {
      x: 1300,
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
  new Pie({
    position: {
      x: 1800,
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
  if (!keepAnimating) {
    return;
  }
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //loops through background array
  for (let i = 0; i < backgrounds.length; i++) {
    backgrounds[i].draw();
  }

  //loops through platforms arrray
  platforms.forEach((platform) => {
    platform.draw();
  });
  //platform collision
  platforms.forEach((platform) => {
    if (
      sonic.position.y + sonic.height <= platform.position.y &&
      sonic.position.y + sonic.height + sonic.velocity.y >=
        platform.position.y &&
      sonic.position.x + sonic.width >= platform.position.x &&
      sonic.position.x <= platform.position.x + platform.width
    ) {
      sonic.velocity.y = 0;
    }
  });

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
        // startGame();
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
  // tsi
  pies.forEach((pie) => {
    // detects for collision between obstacle and player
    if (
      sonic.position.x + sonic.width >= pie.position.x &&
      sonic.position.x <= pie.position.x + pie.width &&
      sonic.position.y + sonic.height >= pie.position.y &&
      sonic.position.y <= pie.position.y + pie.height
    ) {
      // damage - restart game when player has no lives left
      if (health < 0) {
        // startGame();
      } else {
        // decrements health and pushes player back slightly
        pie.clear();
        if (pie.position.x > sonic.position.x) {
			// Count score
			score = score + 100;
		}
		sonic.position.y -= 50;
		sonic.position.x += 150;;
      }
      document.getElementById("currentScore").innerHTML = `Score: ${score}`;
    }
    pie.update();
  });

  // SHOW SCORE
  //refactor made here to ensure when a player reverses they don't get points taken away
  // score = Math.max(score, sonic.position.x / 2);
  // if (score === 100) {
  // 	document.getElementById("currentScore").innerHTML = `Score: ${score}`;
  // }
  // if (score === 300) {
  // 	document.getElementById("currentScore").innerHTML = `Score: ${score}`;
  // }
  // if (score === 500) {
  // 	document.getElementById("currentScore").innerHTML = `Score: ${score}`;
  // }

  // updates player
  sonic.update();

  if (keys.right.pressed && sonic.position.x < 500) {
    sonic.velocity.x = 5;
  } else if (keys.left.pressed && sonic.position.x > 50) {
    sonic.velocity.x = -5;
  } else {
    sonic.velocity.x = 0;

    // handles background image scrolling
    if (keys.right.pressed) {
      scrollPosition += 5;
      for (let i = 0; i < backgrounds.length; i++) {
        backgrounds[i].position.x -= 5;
      }
      for (let i = 0; i < platforms.length; i++) {
        platforms[i].position.x -= 5;
      }
      for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].position.x -= 5;
      }
      for (let i = 0; i < pies.length; i++) {
        pies[i].position.x -= 5;
      }
    } else if (keys.left.pressed && scrollPosition > 0) {
      scrollPosition -= 5;
      for (let i = 0; i < backgrounds.length; i++) {
        backgrounds[i].position.x += 5;
      }
      for (let i = 0; i < platforms.length; i++) {
        platforms[i].position.x += 5;
      }
      for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].position.x += 5;
      }
      for (let i = 0; i < pies.length; i++) {
        pies[i].position.x += 5;
      }
    }
  }
  endGame();
  playBGM();
}

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
      if (!keys.spacebar.pressed) {
        keys.spacebar.pressed = true;
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
      keys.spacebar.pressed = false;
      if (!keys.spacebar.pressed && sonic.velocity.y != 0) {
        sonic.velocity.y += 14;
      }
      break;
  }
});

// });

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

// Countdown to start
//Grab the count down
let countdown_num = document.querySelector(".text_count");
let countdown_num_wrapper = document.getElementById("count_down");
let remainingTime = 3;
let end_time = "Start !!!";
function reduceCount() {
  countdown_num.innerHTML = remainingTime;
  let countdown_timer = setInterval(() => {
    keepAnimating = false;
    remainingTime--;
    countdown_num.innerHTML = remainingTime;

    if (remainingTime <= 0) {
      countdown_num.innerHTML = end_time;
      clearInterval(countdown_timer);
      keepAnimating = true;
      requestAnimationFrame(animate);
    }
  }, 1000);
}

//const startTimeout =
function undoDisplay() {
  countdown_num_wrapper.style.display = "none";
  onTimer();
}

//Countdown to start ends.

let i = 60;
let timeout;
let stopTime = -1;

function onTimer() {
  document.getElementById("countdown").innerHTML = i;
  i--;
  timeout = setTimeout(onTimer, 1000);
  if (i <= stopTime) {
    clearTimeout(timeout);
    setTimeout(
      () => window.open("http://127.0.0.1:5505/game%20over.html"),
      1000
    );
  }
}

//Paws Menu
//Open press the ESC it should have resume and quit buttons.
const paws_Menu = document.querySelector("#paws");

addEventListener("keydown", (e) => {
  let name = e.key;
  let code = e.code;

  if (code === "Escape" && name === "Escape") {
    displayPaws();
    clearTimer();
    keepAnimating = false;
  }
  console.log(`ESC ${keepAnimating}`);
});

paws_Menu.style.display = "none";
function displayPaws() {
  if (paws_Menu.style.display === "none") {
    paws_Menu.style.display = "flex";
  } else {
    paws_Menu.style.display = "none";
  }
}

// Clear Timer
//get the current timer
current_timer = document.getElementById("countdown").innerHTML;
// stop the current on the click of esacpe key
function clearTimer() {
  console.log(timeout);
  clearTimeout(timeout);
}

// Quit Button
const quit_btn = document.querySelector("#btnQ");
quit_btn.addEventListener("click", Quit);
function Quit() {
  playing = false;
  let muteState = mute;
  location.reload();
  paws_Menu.style.display = "none";
  timeout = setTimeout(onTimer, 1000);
  mute = muteState;
  return (current_timer = timeout);
}

// Resume Button
/**
   * While paused gameplay should also pause
    -Timer stops
    -Player cannot move
    -Obstacles should stop
   */

const resume_btn = document.querySelector("#btnS");
resume_btn.addEventListener("click", Resume);
function Resume() {
  onTimer();
  paws_Menu.style.display = "none";
  keepAnimating = true;
  animate();
  requestAnimationFrame(animate);
  console.log("i have resumed");
}

// This that can be improved on(getting escape to pause and play)

// prompts end score modal if time <= 0 or if player reaches end of level
// end of level is currently based on scroll position
function endGame() {
  if (i <= stopTime || scrollPosition == 5800) {
    keepAnimating = false;
    endScoreModal.draw();
    console.log("game over");
    gameoverscreen.classList.remove("hide");
    gameoverscreen.style.display = "flex";
  }
  //gameoverscreen.classList.remove('hide')
}
function closegameover() {
  gameoverscreen.classList.add("hide");
}
