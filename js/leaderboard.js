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
});
