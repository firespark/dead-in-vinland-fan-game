const wrongLanePenalty = 50;
const wrongLaneShieldPenalty = 50;


function recreateNode(element) {
    let newElement = element.cloneNode(false);
    while (element.hasChildNodes()) newElement.appendChild(element.firstChild);
    element.parentNode.replaceChild(newElement, element);
}

function numberRange(start, end) {
    return new Array(end + 1 - start).fill().map((d, i) => i + start);
}

function percentageSubstract(n, p) {
    return n - n * (p / 100);
}

function delay(delay) {
    let time = currentDeltaTime;

    const poll = (resolve) => {
        if (currentDeltaTime > time + delay) resolve();
        else setTimeout((_) => poll(resolve), 100);
    };

    return new Promise(poll);
}

function DeltaTimer(gameLoop, interval) {
    let timeout;
    let lastTime;

    this.start = start;
    this.stop = stop;

    function start() {
        timeout = setTimeout(loop, 0);
        lastTime = Date.now();
        return lastTime;
    }

    function stop() {
        clearTimeout(timeout);
        return lastTime;
    }

    function loop() {
        let thisTime = Date.now();
        let deltaTime = thisTime - lastTime;
        let delay = Math.max(interval - deltaTime, 0);
        timeout = setTimeout(loop, delay);
        lastTime = thisTime + delay;
        gameLoop(thisTime);
    }
}


function calculateDamage(origin, target, damageAmount, attackType = 'melee') {
    damageAmount = Math.round((damageAmount * origin.strength) / 100);
    let damageTotal = Math.round(percentageSubstract(damageAmount, target.defense));
    if (damageTotal < 0) damageTotal = 0;
    const rowType = getRowType(origin)
    if ((rowType != attackType) && attackType != 'any') {
        let oldDamage = damageTotal;
        damageTotal = Math.round(percentageSubstract(damageAmount, wrongLanePenalty));
        //console.log(`applied penalty - reduced from ${oldDamage} to ${damageTotal}`)
    }

    return damageTotal;
}

function getRowType(unit) {
    const currentRowType = document.getElementById(`section${allUnits[unit.id].pos}`).parentNode.dataset.type;
    return currentRowType;
}

function isHit(unit) {
    const randomValue = Math.floor(Math.random() * 101);
    if (randomValue <= unit.aim)
        return true;
    return false;
}
function drawStatusEffects(targetID) {
    const statusBar = document.querySelector(`#unit${targetID} .unit-effects`);
    if (statusBar) {
        statusBar.innerHTML = '';

        let iconsDiv = document.createElement('div');
        iconsDiv.classList.add('effect-icons');
        allUnits[targetID].buffArray.forEach(buff => {
            let icon = document.createElement('img');
            icon.src = `img/battle-icons/small-${buff}.png`;
            iconsDiv.append(icon);
        });

        let statsDiv = document.createElement('div');
        statsDiv.classList.add('effect-text');
        statsDiv.innerHTML = `Defence: ${allUnits[targetID].defense} | Strength: ${allUnits[targetID].strength} | Aim: ${allUnits[targetID].aim}`

        statusBar.append(iconsDiv);
        statusBar.append(statsDiv);
    }
}

function statisticsAdd(result) {
    const statCondition = localStorage.getItem('statCondition') ? JSON.parse(localStorage.getItem('statCondition')) : [];

    const date = new Date();

    const statObjItem = {
        date: `${date.getFullYear()}.${('0' + date.getMonth()).slice(-2)}.${('0' + date.getDate()).slice(-2)} ${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`,
        level: difficulty,
        result: result,
    };
    if (statCondition.length > 9) {
        statCondition.splice(0, 1);
    }
    statCondition.push(statObjItem);
    localStorage.setItem('statCondition', JSON.stringify(statCondition));

    //console.log(statCondition);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}

function playAudio(title) {
    if (title != '') {
        const audio = new Audio();
        audio.src = `./audio/${title}.mp3`;
        audio.currentTime = 0;
        audio.loop = false;
        audio.play();
    }
}

function cleanUpEndGame() {

    gameEnded = true;
    allUnits = [];
    selectedWarriors = [];
    takenWarriorPlaces = [];
    takenEnemyPlaces = [];
    activeUnit = 0;
    let positions = document.querySelectorAll('.field-row-section');
    positions.forEach(position => {
        position.innerHTML = '';
    });
    const warriorDivs = document.querySelectorAll('.warrior');
    warriorDivs.forEach(warrior => {
        warrior.classList.remove('active');
        warrior.classList.remove('disabled');
    });
    logString(`FIGHT!`);
}