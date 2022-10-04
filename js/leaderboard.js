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