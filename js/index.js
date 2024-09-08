let selectedWarriors = [];
let gameEnded = true;
let enableAI = true;

difficultyChoice();
settingsWarriorsInit();
settingsWarriorsAddOnClick();
startGameButton();

let takenWarriorPlaces = [];
let takenEnemyPlaces = [];

let allUnits = [];
let activeUnit = 0;


let timer = new DeltaTimer(gameLoop, 500);
let start = timer.start();
let currentDeltaTime = 0;




function gameOver() {
    statisticsAdd('Died');
    playAudio('died');
    document.querySelector('.notice-overlay').classList.remove('dnone');
    document.querySelector('.notice-block.fail').classList.remove('dnone');
    cleanUpEndGame()
}

function gameWon() {
    statisticsAdd('Won');
    playAudio('won');
    document.querySelector('.notice-overlay').classList.remove('dnone');
    document.querySelector('.notice-block.success').classList.remove('dnone');
    cleanUpEndGame()
}

function gameLoop(time) {
    time -= start;
    currentDeltaTime = time;
}

document.getElementById('year').textContent = new Date().getFullYear();
