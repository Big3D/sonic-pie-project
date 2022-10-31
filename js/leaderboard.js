//selects the leader board button
const leaderBoardButtton = document.getElementById('leaderboard-button');

//adds event listener for click
leaderBoardButtton.addEventListener('click', leadDisplay);

function leadDisplay(){
  let x = document.getElementById("leaderBoardMenu");
  if (x.style.display === "none") {
    x.style.display = "inline";
  } 
  else {
    x.style.display = "none";
  }

  let ref = firebase.ref(firebase.db, "scores");
  firebase.get(ref).then(function(data) {
    let scores = data.val()
    let scoresArray = Object.values(scores).filter(x => x.username);
    let sortedScores = scoresArray.sort((a, b) => (a.score < b.score) ? 1 : -1)
    let highScores = scoresArray.slice(0, 10)
    console.log(highScores)

    for (let i = 0; i < highScores.length; i++) {
      let leaderPlace = document.querySelector('.leaderboard-content').children[i];
      leaderPlace.querySelector(".score").innerHTML = highScores[i].score
      leaderPlace.querySelector(".name").innerHTML = highScores[i].username
    } 
  });
}

document.addEventListener('mouseup', function(e) {
  let container = document.getElementById('leaderBoardMenu');
  if (!container.contains(e.target)) {
      container.style.display = 'none';
  }
});




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