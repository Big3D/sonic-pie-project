//adds click event listener to the start button
document.getElementById("start-button").addEventListener("click", startGame);

//function that will start the canvas game
function startGame() {
  console.log("start");
}

//Menu Canvas Design
const Menu_Canvas = document.getElementById("menu_canvas");
let mtx = Menu_Canvas.getContext("2d");

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
// const box_width = 30;
// const box_height = 30;
// let startX = 30;
// let startY = 450;

// gravity
const gravity = 0.5;
//SCORE
let score = 0
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
    this.width = 30;
    this.height = 30;
  }

  // render player
  draw() {
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
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

// new instance - sonic
const sonic = new Player();

const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

sonic.update();

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  sonic.update();

  if (keys.right.pressed) {
    sonic.velocity.x = 5;
    // SHOW SCORE 
    //
    score = sonic.position.x
    document.getElementById('currentScore').innerHTML = `Score: ${score}`
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
      sonic.velocity.y -= 10;
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
      sonic.velocity.y -= 10;
      break;
  }
});
// Timer 
        i = 60;
        function onTimer() {
            
            document.getElementById("countdown").innerHTML = i;
            i--;
            if (i < 0) {
            
                clearInterval(i);
                if(i===0) {
                    alert("Game Over!");   
                    }
            }
            else {
                setTimeout(onTimer, 1000);
            }
        }
   
