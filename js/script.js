//adds click event listener to the start button
const Menu_Canvas = document.getElementById("menu_canvas");
let mtx = Menu_Canvas.getContext("2d");
let start_button = document.getElementById("start-button");
let leaderboard_button = document.getElementById("leaderboard-button");
let gameoverscreen = document.getElementById("gameover_background");
//Audiocat sounds
let hungry = new Audio("cat-hungry-meow.wav");
let angry = new Audio("angry-kitty-meow.wav");
let pain = new Audio("cat-pain-meow.wav");
//Added counter and score display none by default
let currentScore = document.getElementById("currentScore");
let countdown = document.getElementById("countdown");
currentScore.style.display = "none";
countdown.style.display = "none";

leaderBoardMenu.style.display = "none";
Menu_Canvas.width = 1920;
Menu_Canvas.height = 1080;
let keepAnimating = true;
let grounded;

//// Audio Testing ////
let playing = false;

const titleBGM1 = new Audio("/audio/BGM/Title-theme1.mp3");
const GameBGM1 = new Audio("/audio/BGM/Game-BGM1.mp3");

////Set this to TRUE to stop the music reloading constantly
let mute = false;

function playBGM() {
  if (!mute && !playing) {
    titleBGM1.onload = titleBGM1.play();
    GameBGM1.pause();
  } else if (!mute && playing) {
    GameBGM1.onload = GameBGM1.play();
    titleBGM1.pause();
  } else if (mute) {
    GameBGM1.pause();
    titleBGM1.pause();
  }
}

function muteUnmute() {
  if (!mute) {
    console.log("Mute");
    mute = true;
    playBGM();
  } else if (mute) {
    console.log("Unmute");
    mute = false;
    playBGM();
  }
}

playBGM();
////-- Audio Testing --////

// Using Boolean to stop start countdown
let countingDown = false;
start_button.addEventListener("click", StartGame);
function StartGame() {
  if (!playing) {
    playing = true;
  }

  let removeDisplay = new Promise((resolve) => {
    resolve("success");
  });
  removeDisplay
    .then(() => {
      reduceCount();
    })
    .then(() => {
      setTimeout(() => {
        undoDisplay();
      }, 4000);
    })
    .then(() => {
      setTimeout(() => {
        EscapePaws();
      }, 4000);
    });

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
canvas.width = 1920;
canvas.height = 1080;

// gravity
const gravity = 0.5;
//SCORE
let score = 0;

//// Cat animation ////
const playerSprite1 = new Image();
const playerSprite2 = new Image();

const playerWalkRightSpriteRef = "/img/CAT WALK PNGs/WalkRightSpriteSheetC.png";
const playerWalkRightSprite = new Image();
playerWalkRightSprite.src = playerWalkRightSpriteRef;
const playerWalkLeftSpriteRef = "/img/CAT WALK PNGs/WalkLeftSpriteSheetC.png";
const playerWalkLeftSprite = new Image();
playerWalkLeftSprite.src = playerWalkLeftSpriteRef;
const playerJumpRightSpriteRef = "/img/CAT_JUMP_PNGs/JumpRightSpriteSheetC.png";
const playerJumpRightSprite = new Image();
playerJumpRightSprite.src = playerJumpRightSpriteRef;
const playerJumpLeftSpriteRef = "/img/CAT_JUMP_PNGs/JumpLeftSpriteSheetC.png";
const playerJumpLeftSprite = new Image();
playerJumpLeftSprite.src = playerJumpLeftSpriteRef;

playerSprite1.src = "/img/CAT WALK PNGs/Sonic Walk COLOR 8.png";
playerSprite2.src = "/img/CAT WALK PNGs/Sonic Walk COLOR 8 left.png";
let previousPos;
let jumpUp;
let jumpDown;
let jumpMid;
let finishFrame;
let right;
let direction;

//// Catanimation states
function playerState(val) {
  switch (val) {
    case "Jump":
      if (right) {
        sonic.currentSprite = sonic.sprites.jump.right;
      } else {
        sonic.currentSprite = sonic.sprites.jump.left;
      }
      sonic.currentAnimSpeed = sonic.sprites.jump.animSpeed;
      sonic.currentFrameSheet = sonic.sprites.jump.frameSheet;
      if (jumpUp) {
        if (sonic.frames < 2) {
          sonic.frames++;
          console.log("jumping up");
        } else sonic.frames = 2;
      } else if (jumpMid) {
        if (sonic.frames < 6) {
          sonic.frames++;
        }
      } else if (jumpDown) {
        if (!grounded && sonic.frames < 6) {
          sonic.frames++;
        } else if (!grounded) {
          sonic.frames = 6;
        } else if (
          grounded &&
          sonic.frames == sonic.sprites.jump.frameSheet &&
          !finishFrame
        ) {
          finishFrame = true;
        } else if (finishFrame && grounded) {
          sonic.currentSprite = sonic.sprites.walk.right;
          sonic.frames = 0;
        }
      }
      break;
    case "Walk":
      if (!right) {
        sonic.currentSprite = sonic.sprites.walk.left;
      } else {
        sonic.currentSprite = sonic.sprites.walk.right;
      }
      sonic.currentAnimSpeed = sonic.sprites.walk.animSpeed;
      sonic.currentFrameSheet = sonic.sprites.walk.frameSheet;
      break;
    case "Stand":
      sonic.currentFrameSheet = 0;
      sonic.currentAnimSpeed = 100;
      if (!right) {
        sonic.currentSprite = sonic.sprites.stand.left;
      } else {
        sonic.currentSprite = sonic.sprites.stand.right;
      }
      break;
    default:
      console.log("cannot Define state");
  }
  return val;
}

////-- Cat animation --////

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
    this.height = 160;
    this.image = playerSprite1;
    this.frames = 0;
    this.frameCounter = 0;

    //// These are the sprite states that hold values for animations
    this.sprites = {
      stand: {
        right: playerSprite1,
        left: playerSprite1,
        frameSheet: 7,
        animSpeed: 18,
      },
      walk: {
        right: playerWalkRightSprite,
        left: playerWalkLeftSprite,
        frameSheet: 7,
        animSpeed: 18,
      },
      //// Need to add delay to the first few frames so that Sonic isnt mid way through jump before leaving ground
      jump: {
        right: playerJumpRightSprite,
        left: playerJumpLeftSprite,
        frameSheet: 8,
        animSpeed: 10,
      },
    };

    if (!grounded) {
      this.currentSprite = this.sprites.jump.right;
    } else {
      this.currentSprite = this.sprites.stand.right;
    }
    this.currentFrameSheet = this.sprites.stand.frameSheet;
    this.currentAnimSpeed = this.sprites.stand.animSpeed;
  }

  // render player
  draw() {
    mtx.drawImage(
      this.currentSprite,
      256 * this.frames,
      0,
      256,
      256,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    //// Animation Update
    this.frameCounter++;
    previousPos = this.position.y;

    //// Frame limiter for animations
    if (this.frameCounter > this.currentAnimSpeed) {
      this.frames++;
      this.frameCounter = 0;
    } else if (this.frames > this.currentFrameSheet - 1) {
      this.frames = 0;
      if (finishFrame) {
        finishFrame = false;
      }
    }

    //// Animation Update

    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // makes player position always hit the ground of the canvas
    //// Added 150 to the height so that the player stand on the actual floor
    if (this.position.y + this.height + this.velocity.y <= canvas.height - 150)
      this.velocity.y += gravity;
    else {
      this.velocity.y = 0;
      // console.log('grounded');
    }

    if (!grounded) {
      playerState("Jump");
      // console.log("Jumping");
    } else if (grounded) {
      if (keys.right.pressed || keys.left.pressed) {
        playerState("Walk");
        // console.log("Walking");
      } else if (
        !keys.left.pressed &&
        !keys.right.pressed &&
        !keys.spacebar.pressed
      ) {
        playerState("Stand");
        // console.log('Standing')
      }
    }
  }
}

// platform sprite
const platformSprite = new Image();
platformSprite.src = "/img/Platform-img/Platform 03.png";

// CLASS CONTRUCTOR FOR PLATFORMS
class Platform {
  constructor({ x, y }) {
    this.position = {
      x,
      y,
    };
    this.width = 280;
    this.height = 90;
    this.platformImage = platformSprite;
  }
  draw() {
    ctx.drawImage(
      this.platformImage,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}

// saw sprite image
const sawSprite = new Image();
sawSprite.src = "/img/Obstacles_img/Saw.png";
// horizontal saw obstacle class -- moves left and right
class HorizontalSaw {
  constructor({ position, velocity, distance }) {
    this.position = {
      x: position.x,
      y: position.y,
    };
    this.velocity = {
      x: velocity.x,
      y: velocity.y,
    };
    this.image = sawSprite;
    this.width = sawSprite.width;
    this.height = sawSprite.height;

    this.distance = distance;
  }
  draw() {
    ctx.drawImage(
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

    // makes obstacle go back and forth
    this.distance.traveled += Math.abs(this.velocity.x);

    if (this.distance.traveled > this.distance.limit) {
      this.distance.traveled = 0;
      this.velocity.x = -this.velocity.x;
    }
  }
}

// vertical saw obstacle class -- moves up and down
class VerticalSaw {
  constructor({ position, velocity, distance }) {
    this.position = {
      x: position.x,
      y: position.y,
    };
    this.velocity = {
      x: velocity.x,
      y: velocity.y,
    };
    this.image = sawSprite;
    this.width = sawSprite.width;
    this.height = sawSprite.height;

    this.distance = distance;
  }
  draw() {
    ctx.drawImage(
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

    // makes obstacle move vertically
    this.distance.traveled += Math.abs(this.velocity.y);

    if (this.distance.traveled > this.distance.limit) {
      this.distance.traveled = 0;
      this.velocity.y = -this.velocity.y;
    }
  }
}

// water drop sprite image
const waterDropSprite = new Image();
waterDropSprite.src = "/img/Obstacles_img/Dripping_Water.png";
// water drops obstacle class -- moves down and repeats
class WaterDrops {
  constructor({ position, velocity, distance }) {
    this.position = {
      x: position.x,
      y: position.y,
    };
    this.velocity = {
      x: velocity.x,
      y: velocity.y,
    };
    this.image = waterDropSprite;
    this.width = waterDropSprite.width + 20;
    this.height = waterDropSprite.height + 25;

    this.distance = distance;
    this.alive = true;
  }
  draw() {
    ctx.drawImage(
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

    // makes obstacle move vertically
    this.distance.traveled += Math.abs(this.velocity.y);

    if (this.distance.traveled > this.distance.limit) {
      this.distance.traveled = 0;
      // repeats position from top
      this.position.y = 550;
    }
  }
}

// skeleton hand sprite image
const skeletonHandSprite = new Image();
skeletonHandSprite.src = "/img/Obstacles_img/Skeleton_Hand.png";

// saw line sprite image
const sawLineSprite = new Image();
sawLineSprite.src = "/img/Platform-img/Saw_Line.png";

// rotated (horizontal) saw line sprite image
const rotatedSawLineSprite = new Image();
rotatedSawLineSprite.src = "/img/Platform-img/Saw_Line_H.png";

// obstacle class -- static
class StaticObstacle {
  constructor({ x, y, width, height, image }) {
    this.position = {
      x,
      y,
    };

    this.image = image;
    this.width = width;
    this.height = height;
  }

  draw() {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}

// pie sprite image
const pieSprite = new Image();
pieSprite.src = "/img/Obstacles_img/pie.png";

// pie class
class Pie {
  constructor({ x, y, image }, lastPie) {
    this.position = {
      x,
      y,
    };

    this.image = image;
    this.width = image.width / Math.PI;
    this.height = image.height / Math.PI;

    this.alive = true;
    this.lastPie = lastPie;
  }

  endGame() {
    showFinal_details();
    clearTimer();
    keepAnimating = false;
    gameoverscreen.classList.remove("hide");
    gameoverscreen.style.display = "flex";
    const youWin = document.querySelector(".gameover");
    youWin.innerHTML = "You Win!!";
  }

  //Draw pie
  draw() {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
  clear() {
    hungry.play();//tsi
    this.alive = false;
  }
  update() {
    if (this.alive === true) {
      this.draw();
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
  new Platform({ x: 300, y: 750 }),
  new Platform({ x: 700, y: 500 }),
  new Platform({ x: 1100, y: 250 }),
  new Platform({ x: 2500, y: 750 }),
  new Platform({ x: 2900, y: 500 }),
  new Platform({ x: 3300, y: 250 }),
  new Platform({ x: 3700, y: 500 }),
  new Platform({ x: 4100, y: 250 }),
  new Platform({ x: 4800, y: 750 }),
  new Platform({ x: 5300, y: 500 }),
  new Platform({ x: 5700, y: 750 }),
  new Platform({ x: 6500, y: 750 }),
  new Platform({ x: 6900, y: 500 }),
  new Platform({ x: 7300, y: 300 }),
  new Platform({ x: 8250, y: 700 }),
  new Platform({ x: 8600, y: 400 }),
  new Platform({ x: 9000, y: 250 }),
  new Platform({ x: 9500, y: 750 }),
  new Platform({ x: 10000, y: 750 }),
  new Platform({ x: 10500, y: 550 }),
  new Platform({ x: 10900, y: 750 }),
  new Platform({ x: 11300, y: 750 }),
  new Platform({ x: 11500, y: 500 }),
  new Platform({ x: 11800, y: 500 }),
  new Platform({ x: 12200, y: 250 }),
  new Platform({ x: 12800, y: 550 }),
  new Platform({ x: 13200, y: 750 }),
  new Platform({ x: 14000, y: 750 }),
  new Platform({ x: 14300, y: 500 }),
];

// new instance - end score modal
const endScoreModal = new Modal();

// health bar
let health = 100;

// scroll position
let scrollPosition = 0;

// new instance - moving horizontal saw obstacles
let horizontalSaws = [];
horizontalSaws = [
  new HorizontalSaw({
    position: {
      x: 2200,
      y: 500,
    },
    velocity: {
      x: -1,
      y: 0,
    },
    distance: {
      limit: 400,
      traveled: 0,
    },
  }),
  new HorizontalSaw({
    position: {
      x: 8900,
      y: 500,
    },
    velocity: {
      x: -1,
      y: 0,
    },
    distance: {
      limit: 400,
      traveled: 0,
    },
  }),
  new HorizontalSaw({
    position: {
      x: 13200,
      y: 400,
    },
    velocity: {
      x: -1,
      y: 0,
    },
    distance: {
      limit: 400,
      traveled: 0,
    },
  }),
];

// new instance - moving vertical saw obstacles
let verticalSaws = [];
verticalSaws = [
  new VerticalSaw({
    position: {
      x: 4200,
      y: 800,
    },
    velocity: {
      x: 0,
      y: -1,
    },
    distance: {
      limit: 400,
      traveled: 0,
    },
  }),
  new VerticalSaw({
    position: {
      x: 14650,
      y: 800,
    },
    velocity: {
      x: 0,
      y: -1,
    },
    distance: {
      limit: 400,
      traveled: 0,
    },
  }),
];

//new instance - water drops obstacle
let waterDrops = [];
waterDrops = [
  new WaterDrops({
    position: {
      x: 5960,
      y: 550,
    },
    velocity: {
      x: 0,
      y: 1,
    },
    distance: {
      limit: 280,
      traveled: 0,
    },
  }),
  new WaterDrops({
    position: {
      x: 12050,
      y: 550,
    },
    velocity: {
      x: 0,
      y: 1,
    },
    distance: {
      limit: 280,
      traveled: 0,
    },
  }),
];

//new instance - skeleton hands obstacle
const skeletonHands = [
  new StaticObstacle({
    x: 900,
    y: 850,
    image: skeletonHandSprite,
    width: skeletonHandSprite.width - 15,
    height: skeletonHandSprite.height - 25,
  }),
  new StaticObstacle({
    x: 4800,
    y: 850,
    image: skeletonHandSprite,
    width: skeletonHandSprite.width - 15,
    height: skeletonHandSprite.height - 25,
  }),
  new StaticObstacle({
    x: 8300,
    y: 850,
    image: skeletonHandSprite,
    width: skeletonHandSprite.width - 15,
    height: skeletonHandSprite.height - 25,
  }),
  new StaticObstacle({
    x: 9800,
    y: 850,
    image: skeletonHandSprite,
    width: skeletonHandSprite.width - 15,
    height: skeletonHandSprite.height - 25,
  }),
  new StaticObstacle({
    x: 13200,
    y: 850,
    image: skeletonHandSprite,
    width: skeletonHandSprite.width - 15,
    height: skeletonHandSprite.height - 25,
  }),
];

//new instance - saw line
const sawLines = [
  new StaticObstacle({
    x: 4240,
    y: 400,
    image: sawLineSprite,
    width: sawLineSprite.width,
    height: sawLineSprite.height,
  }),
  new StaticObstacle({
    x: 14690,
    y: 400,
    image: sawLineSprite,
    width: sawLineSprite.width,
    height: sawLineSprite.height,
  }),
  new StaticObstacle({
    x: 1800,
    y: 540,
    image: rotatedSawLineSprite,
    width: rotatedSawLineSprite.width,
    height: rotatedSawLineSprite.height,
  }),
  new StaticObstacle({
    x: 8500,
    y: 540,
    image: rotatedSawLineSprite,
    width: rotatedSawLineSprite.width,
    height: rotatedSawLineSprite.height,
  }),
  new StaticObstacle({
    x: 12790,
    y: 440,
    image: rotatedSawLineSprite,
    width: rotatedSawLineSprite.width,
    height: rotatedSawLineSprite.height,
  }),
];

// new instance - pies
const pies = [
  new Pie(
    {
      x: 800,
      y: 470,
      image: pieSprite,
    },
    false
  ),
  new Pie(
    {
      x: 1200,
      y: 860,
      image: pieSprite,
    },
    false
  ),
  new Pie(
    {
      x: 3000,
      y: 860,
      image: pieSprite,
    },
    false
  ),
  new Pie(
    {
      x: 3400,
      y: 220,
      image: pieSprite,
    },
    false
  ),
  new Pie(
    {
      x: 4200,
      y: 220,
      image: pieSprite,
    },
    false
  ),
  new Pie(
    {
      x: 5400,
      y: 860,
      image: pieSprite,
    },
    false
  ),
  new Pie(
    {
      x: 5800,
      y: 720,
      image: pieSprite,
    },
    false
  ),
  new Pie(
    {
      x: 8000,
      y: 860,
      image: pieSprite,
    },
    false
  ),
  new Pie(
    {
      x: 8700,
      y: 360,
      image: pieSprite,
    },
    false
  ),
  new Pie(
    {
      x: 9300,
      y: 860,
      image: pieSprite,
    },
    false
  ),
  new Pie(
    {
      x: 11000,
      y: 720,
      image: pieSprite,
    },
    false
  ),
  new Pie(
    {
      x: 11900,
      y: 460,
      image: pieSprite,
    },
    false
  ),
  new Pie(
    {
      x: 13300,
      y: 720,
      image: pieSprite,
    },
    false
  ),
  new Pie(
    {
      x: 14100,
      y: 720,
      image: pieSprite,
    },
    false
  ),
  // last pie (ends game)
  new Pie(
    {
      x: 15000,
      y: 860,
      image: pieSprite,
    },
    true
  ),
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

  //// Setting Jump/Grounded states
  if (sonic.velocity.y != 0) {
    grounded = false;
  } else if (sonic.velocity.y == 0 && !keys.spacebar.pressed) {
    grounded = true;
  }
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //// Checking jump state
  if (sonic.position.y < previousPos) {
    jumpUp = true;
    jumpDn = false;
    jumpMid = false;
  } else if (sonic.position.y > previousPos) {
    jumpDown = true;
    jumpUp = false;
    jumpMid = false;
  } else if (sonic.position.y == previousPos && !grounded) {
    jumpMid;
    !jumpDown;
    !jumpUp;
  }

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
      grounded = true;
    }
  });

  // renders each skeleton hand in array
  sawLines.forEach((sawLine) => {
    sawLine.draw();
  });

  // updates each horizontal saw obstacle in the array
  horizontalSaws.forEach((horizontalSaw) => {
    // detects for collision between obstacle and player
    if (
      sonic.position.x + sonic.width >= horizontalSaw.position.x &&
      sonic.position.x <= horizontalSaw.position.x + horizontalSaw.width &&
      sonic.position.y + sonic.height >= horizontalSaw.position.y &&
      sonic.position.y <= horizontalSaw.position.y + horizontalSaw.height
    ) {
      // damage - restart game when player has no lives left
      if (health < 0) {
        // startGame();
      } else {
        // tsi
				pain.play();
        // decrements health and pushes player back slightly
        health--;
        sonic.position.y -= 50;
        sonic.position.x -= 150;
      }
    }
    horizontalSaw.update();
  });

  // updates each vertical saw obstacle in the array
  verticalSaws.forEach((verticalSaw) => {
    // detects for collision between obstacle and player
    if (
      sonic.position.x + sonic.width >= verticalSaw.position.x &&
      sonic.position.x <= verticalSaw.position.x + verticalSaw.width &&
      sonic.position.y + sonic.height >= verticalSaw.position.y &&
      sonic.position.y <= verticalSaw.position.y + verticalSaw.height
    ) {
      // damage - restart game when player has no lives left
      if (health < 0) {
        // startGame();
      } else {
        pain.play();//tsi
        // decrements health and pushes player back slightly
        health--;
        sonic.position.y -= 50;
        sonic.position.x -= 150;
      }
    }
    verticalSaw.update();
  });

  // updates each water drop obstacle in the array
  waterDrops.forEach((waterDrop) => {
    // detects for collision between obstacle and player
    if (
      sonic.position.x + sonic.width >= waterDrop.position.x &&
      sonic.position.x <= waterDrop.position.x + waterDrop.width &&
      sonic.position.y + sonic.height >= waterDrop.position.y &&
      sonic.position.y <= waterDrop.position.y + waterDrop.height
    ) {
      // decrements health and pushes player back slightly
      pain.play();//tsi
      health--;
      sonic.position.y -= 50;
      sonic.position.x -= 150;
    }
    waterDrop.update();
  });

  // renders each skeleton hand in array
  skeletonHands.forEach((skeletonHand) => {
    skeletonHand.draw();
    if (
      sonic.position.x + sonic.width >= skeletonHand.position.x &&
      sonic.position.x <= skeletonHand.position.x + skeletonHand.width &&
      sonic.position.y + sonic.height >= skeletonHand.position.y &&
      sonic.position.y <= skeletonHand.position.y + skeletonHand.height
    ) {
      // decrements health and pushes player back slightly
      pain.play();//tsi
      health--;
      sonic.position.y -= 50;
      sonic.position.x -= 150;
    }
  });

  // renders each pie in array
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
        // clears pie and adds to score
        pie.clear();
        score = score + 100;
      }
      document.getElementById("currentScore").innerHTML = `Score: ${score}`;
      if (pie.lastPie === true) {
        pie.endGame();
      }
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
      for (let i = 0; i < sawLines.length; i++) {
        sawLines[i].position.x -= 5;
      }
      for (let i = 0; i < horizontalSaws.length; i++) {
        horizontalSaws[i].position.x -= 5;
      }
      for (let i = 0; i < verticalSaws.length; i++) {
        verticalSaws[i].position.x -= 5;
      }
      for (let i = 0; i < waterDrops.length; i++) {
        waterDrops[i].position.x -= 5;
      }
      for (let i = 0; i < skeletonHands.length; i++) {
        skeletonHands[i].position.x -= 5;
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
      for (let i = 0; i < sawLines.length; i++) {
        sawLines[i].position.x += 5;
      }
      for (let i = 0; i < horizontalSaws.length; i++) {
        horizontalSaws[i].position.x += 5;
      }
      for (let i = 0; i < verticalSaws.length; i++) {
        verticalSaws[i].position.x += 5;
      }
      for (let i = 0; i < waterDrops.length; i++) {
        waterDrops[i].position.x += 5;
      }
      for (let i = 0; i < skeletonHands.length; i++) {
        skeletonHands[i].position.x += 5;
      }
      for (let i = 0; i < pies.length; i++) {
        pies[i].position.x += 5;
      }
    }
  }

  TimeUp();
  playBGM();
  getScore();
}
console.log(scrollPosition);
// character movement on keydown
addEventListener("keydown", ({ keyCode }) => {
  switch (keyCode) {
    case 37:
      keys.left.pressed = true;
      right = false;
      break;
    case 39:
      keys.right.pressed = true;
      right = true;
      break;
    case 32:
    case 38:
      if (!keys.spacebar.pressed) {
        keys.spacebar.pressed = true;
        sonic.velocity.y -= 18;
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
    case 38:
      keys.spacebar.pressed = false;
      if (!keys.spacebar.pressed && sonic.velocity.y != 0) {
        sonic.velocity.y += 17.9;
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
titleBG.src = "/img/Background-img/Home-page-no-logo.png";
const titleLogo = new Image();
titleLogo.src = "/img/Background-img/Official_LOGO.png";

class TitleBackground {
  constructor({ x, y, titleBG }) {
    this.position = { x, y };

    this.image = titleBG;
    this.width = mtx.width;
    this.height = mtx.height;
  }

  draw() {
    mtx.drawImage(this.image, this.position.x, this.position.y);
  }
}
class TitleLogo {
  constructor({ x, y, titleLogo }) {
    this.position = { x, y };

    this.image = titleLogo;
    this.width = titleLogo.width / 3;
    this.height = titleLogo.height / 3;
  }

  draw() {
    mtx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}

// new instance - title background
const titleScreen = new TitleBackground({ x: 0, y: 0, titleBG });

// new instance - logo
const titleLogoBig = new TitleLogo({
  x: Menu_Canvas.width / 2 - 300,
  y: 0,
  titleLogo,
});

// Loads the title image
window.onload = () => {
  titleScreen.draw();
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
      // tsi
      currentScore.style.display = "block";
      countdown.style.display = "block";

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
    // setTimeout(
    //   () => window.open("http://127.0.0.1:5505/game%20over.html"),
    //   1000
    // );
  }
}

//Paws Menu
//Open press the ESC it should have resume and quit buttons.
const paws_Menu = document.querySelector("#paws");
function EscapePaws() {
  addEventListener("keydown", (e) => {
    let name = e.key;
    let code = e.code;

    if (code === "Escape" && name === "Escape") {
      displayPaws();
      clearTimer();
      keepAnimating = false;
    }
  });
}

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

// Handle the submit button
const submit_btn = document.querySelector("#submit");
submit_btn.addEventListener("click", function (e) {
  e.preventDefault();
  let scoreId = uuidv4();
  let username = document.querySelector("#username").value;
  let data = { username, score };
  let ref = firebase.ref(firebase.db, "scores/" + scoreId);
  firebase.set(ref, data).then(function () {
    leaderBoardMenu.style.display = "block";
    gameoverscreen.style.display = "none";
  });
});

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
// function endGame() {
//   if (i <= stopTime || scrollPosition == 5800) {
//     keepAnimating = false;
//     //endScoreModal.draw();
//     showFinal_details()
//     console.log("game over");

//     gameoverscreen.classList.remove("hide");
//     gameoverscreen.style.display = "flex";
//   }
//   //gameoverscreen.classList.remove('hide')
// }
// function closegameover() {
//   gameoverscreen.classList.add("hide");
// }

//this tells when the time is up
function TimeUp() {
  if (i <= stopTime) {
    keepAnimating = false;
    // tsi
    showFinal_details();

    gameoverscreen.classList.remove("hide");
    gameoverscreen.style.display = "flex";
  }
}
// select all the needed ids for score display
let score_endModal = document.getElementById("s_core");
let timer_bonusModal = document.getElementById("t_imer");
let f_nalModal = document.getElementById("f_score");

// grab Izzy's solutions call them in this function
const showFinal_details = () => {
  score_endModal.innerHTML = `Score: ${score}`;
  timer_bonusModal.innerHTML = `Timer Bonus: ${i} x 100`;
  f_nalModal.innerHTML = `Final Score: ${Math.floor(score + i * 100)} `;
  return;
};

/**
 *
 *
 */

// get score based on scroll position -- called in animate function
function getScore() {
  // set score equal to scrollPosition
  score = scrollPosition;
  document.getElementById("currentScore").innerHTML = `Score: ${score}`;
}
