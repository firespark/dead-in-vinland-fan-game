async function activateBrain() {
    if (allUnits.length > 0) {
        if (allUnits[activeUnit].enemy) {
            let availableActions = [];
            availableActions = [...allUnits[activeUnit].skills];
            availableActions.push('move');
            let continueTurn = true;

            while (enableAI && availableActions.length > 0 && !gameEnded) {
                continueTurn = true;

                if (allUnits[activeUnit].ap <= 0 || !allUnits[activeUnit].alive || !allUnits[activeUnit].enemy)
                    break;

                availableActions.forEach((action, index) => {
                    if (skillsObj[action].apCost > allUnits[activeUnit].ap) {
                        availableActions.splice(index, 1);
                    }
                });

                if (availableActions.length == 1) {
                    if (getRandomInt(0, 1) === 0) {
                        //console.log('Random skipping of turn')
                        continueTurn = false;
                        break;
                    }
                }

                await delay(1500).then(function () {
                    if (!gameEnded && allUnits.length > 0) {
                        if (document.querySelector('.fight-overlay').classList.contains('dnone')
                            && (!document.querySelector(`.death-image`))) {
                            pickRandomAction(availableActions);
                        }
                    }
                });
            }
            if (allUnits[activeUnit]) {
                await delay(2000).then(function () {
                    if (!gameEnded && allUnits[activeUnit].enemy && (allUnits[activeUnit].ap <= 0 || !continueTurn)) {
                        endTurn();
                    }
                });
            }

        }
    }
}

function getRandomHero() {
    let aliveHeroes = allUnits.filter((unit) => !unit.enemy && unit.alive);
    //console.log(aliveHeroes);
    if (aliveHeroes.length == 0) return 'Nothing';
    return aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)].id;
}

function getRandomFoe() {
    let aliveFoes = allUnits.filter((unit) => unit.enemy && unit.alive);
    //console.log(aliveFoes);
    if (aliveFoes.length == 0) return 'Nothing';
    return aliveFoes[Math.floor(Math.random() * aliveFoes.length)].id;
}

function pickRandomAction(availableActions) {
    let randomID = Math.floor(Math.random() * availableActions.length);
    let randomAction = skillsObj[availableActions[randomID]];
    //console.log(`Chose ${randomAction.name} from ${availableActions} (${randomID} out of ${availableActions.length - 1})`);
    if (randomAction.onEnemy) {
        //console.log(randomAction.name);
        let target = getRandomHero();
        if (target == 'Nothing') {
            gameOver();
            return;
        }
        randomAction.use(target);
        return;
    }
    if (randomAction.self) {
        //console.log(randomAction.name);
        randomAction.use(activeUnit);
        return;
    }
    if (!randomAction.onEnemy) {
        //console.log(randomAction.name);
        let target = getRandomFoe();
        if (target == 'Nothing') {
            //gameWon();
            return;
        }
        randomAction.use(target);
        return;
    }
}
