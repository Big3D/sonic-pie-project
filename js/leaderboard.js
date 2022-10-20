//selects the leader board button
const leaderBoardButtton = document.getElementById('leaderboard-button');

//adds event listener for click
leaderBoardButtton.addEventListener('click', leaderList);

//function that executes the leaderboard
function leaderList(){
    console.log('leaderboard');
}

let lbArray = [];

for (let i = 0; i <10; i++) {
   let leaderPlace = document.getElementById(i+1)
  let leaderScore = leaderPlace.querySelector(".score").innerHTML
  let leaderName = leaderPlace.querySelector(".name").innerHTML
  
   console.log(leaderScore)
} 


function leadDisplay(){

let x = document.getElementById("leaderBoardMenu");
  if (x.style.display === "none") {
    x.style.display = "inline";
} 
  else {
    x.style.display = "none";
}
}

function on() {
  document.getElementById("leaderBoardMenu").style.display = "block";
}

function off() {
  document.getElementById("leaderBoardMenu").style.display = "none";
}


// Cyclic Input JS
// KEYCODES = { left: 37, up: 38, right: 39, down: 40 };

// $('.cyclic_input').on('keydown',function(ev){
//     input = $(this);
//     val = $(this).text();
    
//     switch (ev.keyCode) {   
//       case KEYCODES.right:
//         input.next().focus();
//         break;
//       case KEYCODES.left:
//         input.prev().focus();
//         break;
//       case KEYCODES.up:
//         input.text(advanceCharBy(val, 1));
//         break;
//       case KEYCODES.down:
//         input.text(advanceCharBy(val, -1));
//         break;
//       default:
//         if (ev.keyCode >= 65 && ev.keyCode <= 65 + 26) {
//             input.text(String.fromCharCode(ev.keyCode));
//             input.next().focus()
//         }
//     };
//     ev.preventDefault();
// });

// advanceCharBy = function(char, distance) {
//     oldCode = char.charCodeAt(0);
//     newCode = 65 + (oldCode - 65 + 26 + distance) % 26;
//     return String.fromCharCode(newCode);
// };
// // End of Cyclic Input JS