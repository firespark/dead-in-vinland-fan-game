function createHp(hpNumber, maxHP = hpNumber) {
    let output = '';
    for (let i = 1; i <= hpNumber; i++) {
        output += '<div class="hp"></div>';
    }
    for (let i = 1; i <= maxHP - hpNumber; i++) {
        output += '<div class="hp empty"></div>';
    }
    return output;
}
function createAp(apNumber, maxAp = apNumber) {
    let output = '';
    for (let i = 1; i <= apNumber; i++) {
        output += '<div class="ap"></div>';
    }
    for (let i = 1; i <= maxAp - apNumber; i++) {
        output += '<div class="ap empty"></div>';
    }
    return output;
}
class Buff {
    constructor(name, defense, strength, aim) {
        this.name = name;
        this.defense = defense;
        this.strength = strength;
        this.aim = aim;
    }
}
class Unit {
    constructor(enemy, warriorID, position, unitID = 0) {
        const unitTypeObject = enemy ? enemiesObj[warriorID] : warriorsObj[warriorID];

        this.id = unitID;
        this.imgFolder = unitTypeObject.imgFolder;
        this.description = unitTypeObject.description;

        this.name = unitTypeObject.name;
        this.enemy = enemy;
        this.type = warriorID;
        this.pos = position;
        this.alive = true;

        this.initiative = unitTypeObject.initiative;
        this.skills = unitTypeObject.skills;

        this.maxHP = unitTypeObject.hp;
        this.hp = unitTypeObject.hp;

        this.maxAP = unitTypeObject.ap;
        this.ap = unitTypeObject.ap;

        this.defenseBase = unitTypeObject.defense;
        this.defense = unitTypeObject.defense;

        this.strengthBase = unitTypeObject.strength;
        this.strength = unitTypeObject.strength;

        this.aimBase = unitTypeObject.aim;
        this.aim = unitTypeObject.aim;

        this.buffArray = [];
    }

    resetBuffs() {
        if (this.buffArray.length > 0) {
            this.buffArray.forEach((effect, index) => {
                if (effect.name == 'shield' || effect.name == 'buff') {
                    this.defense -= effect.defense;
                    this.strength -= effect.strength;
                    this.aim -= effect.aim;
                }
            });
            let filteredBuffs = this.buffArray.filter(function (buff) {
                return buff.name == 'debuff';
            });
            this.buffArray = filteredBuffs;
        }

        drawStatusEffects(this.id);
    }

    resetDebuffs() {
        if (this.buffArray.length > 0) {
            this.buffArray.forEach((effect, index) => {
                if (effect.name == 'debuff') {
                    this.defense += effect.defense;
                    this.strength += effect.strength;
                    this.aim += effect.aim;
                }
            });
            let filteredBuffs = this.buffArray.filter(function (buff) {
                return buff.name == 'shield' || buff.name == 'buff';
            });
            this.buffArray = filteredBuffs;
        }
        drawStatusEffects(this.id);
    }

    killUnit() {
        this.alive = false;
        if (this.name == 'Gudrun')
            playAudio('grannydeath');
        else
            playAudio('kill');

        const unitBody = document.querySelector(`.unit[data-id="${this.id}"] .unit-body`);
        const unitPosition = this.pos;
        if (unitBody) {
            const iconDiv = document.createElement('div');

            iconDiv.classList.add('animated-image');
            iconDiv.classList.add('icon-image');
            iconDiv.classList.add(`death-image`);


            iconDiv.addEventListener(
                'animationend',
                function () {
                    const currentPosDiv = document.getElementById(`section${unitPosition}`);
                    currentPosDiv.innerHTML = '';
                    setUnitOrderBar();
                    //checkIfWon();
                }
            );
            unitBody.append(iconDiv);
            delay(3000).then(function () {
                const currentPosDiv = document.getElementById(`section${unitPosition}`);
                currentPosDiv.innerHTML = '';
                setUnitOrderBar();
                checkIfWon();
            })
        }


    }

    setVisualHP() {
        document.querySelector(`#unit${this.id} .unit-health`).innerHTML = createHp(this.hp, this.maxHP);
    }

    damageUnit(damageAmount = 0, origin = activeUnit) {
        this.hp -= damageAmount;
        if (this.hp <= 0) this.hp = 0;
        this.resetBuffs();
        if (this.hp <= 0) this.killUnit();
        else this.setVisualHP();
    }

    changeAP(amountAP = 0) {
        this.ap -= amountAP;
        if (this.ap < 0) this.ap = 0;
        setStatusBar();
    }
}

function createUnit(unit) {
    const enemyClass = unit.enemy ? ' enemy' : '';
    const hps = createHp(unit.hp);
    document.getElementById(`section${unit.pos}`).innerHTML = `
                                    <div class="unit${enemyClass}" data-id=${unit.id} id="unit${unit.id}">
                                        <div class="unit-name">${unit.name}</div>
                                        <div class="unit-health">${hps}</div>
                                        <div class="unit-effects">
                                            <div class="effect-icons">

                                            </div>
                                            <div class="effect-text">Defense: ${unit.defense} | Strength: ${unit.strength} | Aim: ${unit.aim}</div>
                                        </div>
                                        <div class="unit-body">
                                            <img
                                                src="img/${unit.imgFolder}/idle.png"
                                                alt=""
                                            />
                                        </div>
                                    </div>`;
}

function randomWarriorPlace() {
    let place = Math.floor(Math.random() * 6) + 1;
    if (takenWarriorPlaces.indexOf(place) >= 0 || takenWarriorPlaces.indexOf(place - 3) >= 0 || takenWarriorPlaces.indexOf(place + 3) >= 0) {
        place = randomWarriorPlace();
    }
    takenWarriorPlaces.push(place);
    return place;
}
function randomEnemyPlace() {
    let place = Math.floor(Math.random() * (12 - 7 + 1) + 7);
    if (takenEnemyPlaces.indexOf(place) >= 0 || takenEnemyPlaces.indexOf(place - 3) >= 0 || takenEnemyPlaces.indexOf(place + 3) >= 0) {
        place = randomEnemyPlace();
    }
    takenEnemyPlaces.push(place);
    return place;
}

function randomEnemyArray(difficultyLevel) {
    let currentEnemies = [];

    const easyArray = [];
    const mediumArray = [];
    const hardArray = [];

    let enemyID;

    Object.keys(enemiesObj).forEach(function (key) {
        switch (enemiesObj[key].level) {
            case 1:
                easyArray.push(key);
                break;

            case 2:
                mediumArray.push(key);
                break;

            case 3:
                hardArray.push(key);
                break;
        }
    });

    switch (difficultyLevel) {
        case 'easy':
            for (let i = 0; i < 3; i++) {
                enemyID = easyArray[Math.floor(Math.random() * easyArray.length)]
                currentEnemies.push(enemyID);
            }
            break;
        case 'medium':
            for (let i = 0; i < 2; i++) {
                enemyID = easyArray[Math.floor(Math.random() * easyArray.length)]
                currentEnemies.push(enemyID);
            }
            enemyID = mediumArray[Math.floor(Math.random() * mediumArray.length)]
            currentEnemies.push(enemyID);
            break;
        case 'hard':
            for (let i = 0; i < 2; i++) {
                enemyID = easyArray[Math.floor(Math.random() * easyArray.length)]
                currentEnemies.push(enemyID);
            }
            enemyID = hardArray[Math.floor(Math.random() * hardArray.length)]
            currentEnemies.push(enemyID);
            break;
        default:
            break;
    }




    return currentEnemies;
}

function placeUnits() {
    allUnits.forEach((unit) => {
        createUnit(unit);
    });
}
function fillAllUnitList(selectedHeroes, level = 'easy', selectedEnemies = [0, 0, 0]) {
    selectedEnemies = randomEnemyArray(level);
    //selectedEnemies = [2, 2, 2];
    for (let i = 0; i < selectedHeroes.length; i++) {
        let type = selectedHeroes[i];
        const unit = new Unit(false, type, randomWarriorPlace());
        allUnits.push(unit);
    }

    for (let i = 0; i < selectedEnemies.length; i++) {
        let type = selectedEnemies[i];
        const unit = new Unit(true, type, randomEnemyPlace());
        allUnits.push(unit);
    }
    shuffleArray(allUnits);

    allUnits = allUnits.sort((a, b) => b.initiative - a.initiative);
    allUnits.forEach((unit, index) => {
        unit.id = index;
        //if (unit.enemy) unit.hp = 1;
    });
}
