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
    statisticsAdd('Died', 0);
    playAudio('died');
    document.querySelector('.notice-overlay').classList.remove('dnone');
    document.querySelector('.notice-block.fail').classList.remove('dnone');
    cleanUpEndGame();
}

function gameWon() {
    let score = 0;
    allUnits.forEach(unit => {
        if (!unit.enemy && unit.alive) {
            score += unit.hp;
        }
    });
    statisticsAdd('Won', score);
    playAudio('won');
    document.querySelector('.notice-overlay').classList.remove('dnone');
    document.querySelector('.notice-block.success').classList.remove('dnone');
    cleanUpEndGame();
}

function gameLoop(time) {
    time -= start;
    currentDeltaTime = time;
}

document.getElementById('year').textContent = new Date().getFullYear();
