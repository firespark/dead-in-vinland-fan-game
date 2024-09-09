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
    document.querySelector('.notice-block.success').classList.add('dnone');
    document.querySelector('.notice-overlay').classList.remove('dnone');
    document.querySelector('.notice-block.fail').classList.remove('dnone');
    cleanUpEndGame();
}

function gameWon() {
    let maxHP = 0;
    let hp = 0;
    allUnits.forEach(unit => {
        if (!unit.enemy && unit.alive) {
            maxHP += unit.maxHP;
            hp += unit.hp;
        }
    });
    let score = Math.round(hp * 100 / maxHP);
    if (difficulty == 'medium') score * 2;
    if (difficulty == 'hard') score * 3;

    statisticsAdd('Won', score);
    playAudio('won');
    document.querySelector('.notice-score.success span').innerText = score;
    document.querySelector('.notice-block.fail').classList.add('dnone');
    document.querySelector('.notice-overlay').classList.remove('dnone');
    document.querySelector('.notice-block.success').classList.remove('dnone');
    cleanUpEndGame();
}

function gameLoop(time) {
    time -= start;
    currentDeltaTime = time;
}

document.getElementById('year').textContent = new Date().getFullYear();
