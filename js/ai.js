async function activateBrain() {
    if (allUnits[activeUnit].enemy) {
        let availableActions = [];
        availableActions = [...allUnits[activeUnit].skills];
        availableActions.push('move');

        while (enableAI && availableActions.length > 0 && allUnits[activeUnit].ap > 0 && !gameEnded && allUnits[activeUnit].enemy) {

            availableActions.forEach((action, index) => {
                if (skillsObj[action].apCost > allUnits[activeUnit].ap) {
                    console.log(`removed ${skillsObj[action].name} (${skillsObj[action].apCost}/${allUnits[activeUnit].ap})`);
                    availableActions.splice(index, 1);
                }
            });

            await delay(1000).then(function () {
                pickRandomAction(availableActions);
            });
        }
        await delay(1000).then(function () {
            if (!gameEnded && allUnits[activeUnit].enemy && allUnits[activeUnit].ap < 1) {
                endTurn();
            }
        });

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
    console.log(`Chose ${randomAction.name} from ${availableActions} (${randomID} out of ${availableActions.length - 1})`);
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
            gameWon();
            return;
        }
        randomAction.use(target);
        return;
    }
}
