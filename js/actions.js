
function endTurn() {
    allUnits[activeUnit].ap = allUnits[activeUnit].maxAP;

    activeUnit++;

    while (activeUnit <= allUnits.length - 1 && !allUnits[activeUnit].alive)
        activeUnit++;
    if (activeUnit > allUnits.length - 1) activeUnit = 0;
    if (!allUnits[activeUnit].alive) {
        while (activeUnit <= allUnits.length - 1 && !allUnits[activeUnit].alive)
            activeUnit++;
    }

    setStatusBar();
    setUnitOrderBar();
    highlightActive();
    logString(`${allUnits[activeUnit].name}'s turn`);
    delay(1000);
}

function setUnitOrderBar() {
    const orderBar = document.querySelector('.battle-order');
    orderBar.innerHTML = '';

    allUnits.forEach((unit, index) => {
        let mug = document.createElement('div');
        mug.classList.add('order-warrior');
        if (!unit.alive) mug.classList.add('dead');
        if (index == activeUnit) mug.classList.add('active');
        mug.innerHTML = `<img src="img/${unit.imgFolder}/battleIcon.png" alt="${unit.name}" />`;
        orderBar.append(mug);
    });
}

function setStatusBar() {
    const battleIcon = document.getElementById('battle-icon');
    battleIcon.src = `img/${allUnits[activeUnit].imgFolder}/battleIcon.png`;

    document.querySelector('.actions-ap').innerHTML = createAp(allUnits[activeUnit].ap, allUnits[activeUnit].maxAP);
    const actionsBar = document.querySelector('.actions');
    actionsBar.innerHTML = '';
    allUnits[activeUnit].skills.forEach((skill) => {
        const skillStats = skillsObj[skill];
        let button = document.createElement('div');
        button.classList.add('action');
        button.classList.add(skill);

        if (skillStats.apCost <= allUnits[activeUnit].ap) {
            button.addEventListener('click', function () {
                const activeButton = document.querySelector('.action.active');
                if (activeButton) activeButton.classList.remove('active');
                button.classList.add('active');
                resetHighlight();
                playAudio('skill');
                targetSelect(skill);
            });
        }
        let overlay = document.createElement('div');
        overlay.classList.add('action-bg');
        button.append(overlay);

        let tooltip = document.createElement('div');
        tooltip.classList.add('action-tooltip');
        button.append(tooltip);

        let tooltipTitle = document.createElement('div');
        tooltipTitle.classList.add('tooltip-title');
        tooltipTitle.innerHTML = skillStats.name;
        tooltip.append(tooltipTitle);

        let tooltipDesc = document.createElement('div');
        tooltipDesc.classList.add('tooltip-description');

        let descriptionString = `<i>${skillStats.description}</i><br>`
        descriptionString += `<br>AP Cost: ${skillStats.apCost}`;
        descriptionString += `<br>Best used from ${skillStats.rowType} row`;
        descriptionString += '<br>Used on ' + (skillStats.self ? 'self' : (skillStats.onEnemy ? 'enemies' : 'allies')) + (skillStats.affectsRow ? ' (row)' : '');
        descriptionString += (skillStats.attack > 0) ? `<br>Damage: ${skillStats.attack}` : '';
        descriptionString += (skillStats.defenseBuff > 0) ? `<br>Defense modifier: ${skillStats.defenseBuff}` : '';
        descriptionString += (skillStats.strengthBuff > 0) ? `<br>Strength modifier: ${skillStats.strengthBuff}` : '';
        descriptionString += (skillStats.aimBuff > 0) ? `<br>Aim modifier: ${skillStats.aimBuff}` : '';

        tooltipDesc.innerHTML = descriptionString;
        tooltip.append(tooltipDesc);

        let apCost = document.createElement('div');
        apCost.classList.add('actions-ap-cost');
        for (let i = 0; i < skillStats.apCost; i++) {
            let apCostPoint = document.createElement('div');
            apCostPoint.classList.add('ap-cost');
            apCost.append(apCostPoint);
        }
        button.append(apCost);

        if (allUnits[activeUnit].enemy || allUnits[activeUnit].ap < skillStats.apCost) {
            button.classList.add('inactive');
        }
        actionsBar.append(button);
    });

    const moveUnitBtn = document.getElementById('move-unit');
    const endTurnBtn = document.getElementById('end-turn');

    if (allUnits[activeUnit].enemy) {
        if (!moveUnitBtn.classList.contains('inactive')) {
            moveUnitBtn.classList.add('inactive');
        }
        if (!endTurnBtn.classList.contains('inactive')) {
            endTurnBtn.classList.add('inactive');
        }
    }
    else if (allUnits[activeUnit].ap < 1) {
        if (!moveUnitBtn.classList.contains('inactive')) {
            moveUnitBtn.classList.add('inactive');
        }
    } else {
        moveUnitBtn.classList.remove('inactive');
        endTurnBtn.classList.remove('inactive');
    }

}

function resetHighlight() {
    const unitDivs = document.querySelectorAll('.unit');
    unitDivs.forEach((item) => {
        item.classList.remove('select-unit');
        item.classList.remove('row-selected');
        recreateNode(item, true);
    });
}

function highlightActive() {
    if (allUnits.length > 0) {
        if (allUnits[activeUnit].alive) {
            const unitDivs = document.querySelectorAll('.unit');
            unitDivs.forEach((item) => {
                item.classList.remove('active');
            });
            const activeUnitDiv = document.getElementById(`unit${allUnits[activeUnit].id}`);
            activeUnitDiv.classList.add('active');
            if (allUnits[activeUnit].enemy) {
                activateBrain();
            }
        } else {
            endTurn();
        }
    }
}

function targetSelect(skillID) {
    if (skillsObj[skillID].self) {
        const selfTarget = document.getElementById(`unit${allUnits[activeUnit].id}`);
        selfTarget.classList.add('select-unit');
        selfTarget.addEventListener(
            'click',
            function () {
                skillsObj[skillID].use(allUnits[activeUnit].id);
            },
            { once: true }
        );
    } else {
        const unitDivs = document.querySelectorAll('.unit');
        const onEnemy = skillsObj[skillID].onEnemy;
        unitDivs.forEach((item) => {
            if (
                (allUnits[item.dataset.id].enemy == onEnemy && !allUnits[activeUnit].enemy) ||
                (allUnits[item.dataset.id].enemy == !onEnemy && allUnits[activeUnit].enemy)
            ) {
                item.classList.add('select-unit');
                item.addEventListener(
                    'click',
                    function () {

                        skillsObj[skillID].use(item.dataset.id);
                    },
                    { once: true }
                );
                if (skillsObj[skillID].affectsRow) {

                    item.addEventListener(
                        'mouseover',
                        function () {
                            const currentRowUnits = document.getElementById(`section${allUnits[item.dataset.id].pos}`).parentNode.querySelectorAll('.unit');
                            currentRowUnits.forEach(unitInRow => {
                                unitInRow.classList.add('row-selected');
                            });
                        }
                    );
                    item.addEventListener(
                        'mouseout',
                        function () {
                            const currentRowUnits = document.getElementById(`section${allUnits[item.dataset.id].pos}`).parentNode.querySelectorAll('.unit');
                            currentRowUnits.forEach(unitInRow => {
                                unitInRow.classList.remove('row-selected');
                            });
                        }
                    );
                }
            }
        });
    }


}

function setUnitOriginImg(origin, attack = false) {
    const unitImg = document.querySelector(`.unit[data-id="${allUnits[origin].id}"] img`);
    const imgTitle = attack ? 'attack' : 'idle';

    unitImg.classList.add('hidden');

    setTimeout(() => {
        unitImg.src = `img/${allUnits[origin].imgFolder}/${imgTitle}.png`;
        unitImg.classList.remove('hidden');
    }, 300);
}

function setSprite(unit, imgType = 'idle') {
    return new Promise(function (resolve, reject) {
        const unitImg = document.querySelector(`.unit[data-id="${allUnits[unit].id}"] img`);
        unitImg.classList.add('hidden');
        unitImg.addEventListener(
            'animationend',
            function (event) {
                unitImg.src = `img/${allUnits[unit].imgFolder}/${imgType}.png`;
                unitImg.classList.remove('hidden');
            },
            { once: true }
        );
    });
}

function setTargetUnitImg(target, action) {
    const unitBody = document.querySelector(`.unit[data-id="${allUnits[target].id}"] .unit-body`);
    if (unitBody) {
        const iconDiv = document.createElement('div');

        iconDiv.classList.add('animated-image');
        iconDiv.classList.add('icon-image');
        iconDiv.classList.add(`${action}-image`);
        unitBody.append(iconDiv);

        iconDiv.addEventListener(
            'animationend',
            function (event) {
                iconDiv.classList.remove('animated-image');
                iconDiv.classList.add('hidden');
                iconDiv.addEventListener('animationend', function (event) {
                    iconDiv.remove();
                });
            },
            { once: true }
        );

        delay(1000).then(function () {
            const iconDIVs = document.querySelectorAll(`.icon-image`);
            iconDIVs.forEach((icon) => {
                icon.remove();
            });
        });
    }
}

function logString(string) {
    document.querySelector('.battle-description').innerHTML = string;
    //console.log(string)
}

function hitCam(origin, targetArray, damageArray, actionType, audioName = '') {
    const fightOverlay = document.querySelector('.fight-overlay');
    const battleDescription = document.querySelector('.battle-description');
    const leftSide = document.querySelector('.fight-left');
    const rightSide = document.querySelector('.fight-right');
    const fightIcon = document.querySelector('.fight-icon');
    const fightBlockRow = document.querySelector('.fight-block-row');

    leftSide.innerHTML = '';
    rightSide.innerHTML = '';
    fightIcon.innerHTML = '';

    enableAI = false;

    let filename = 'buff.png';
    const originImage = document.createElement('img');
    if (actionType == 'attack') {
        filename = 'attack.png';
        originImage.classList.add('attack-image');
    }
    else {
        originImage.classList.add('buff-image');
    }

    originImage.src = `img/${origin.imgFolder}/${filename}`;

    if (!origin.enemy) {
        leftSide.append(originImage);
        targetArray.forEach(target => {
            if (target.id != origin.id) {
                const targetImage = document.createElement('img');
                targetImage.classList.add('idle-image');
                targetImage.src = `img/${target.imgFolder}/idle.png`;
                rightSide.append(targetImage);
            }
        });
    }
    else {
        rightSide.append(originImage);
        targetArray.forEach(target => {
            if (target.id != origin.id) {
                const targetImage = document.createElement('img');
                targetImage.classList.add('idle-image');
                targetImage.src = `img/${target.imgFolder}/idle.png`;
                leftSide.append(targetImage);
            }
        });
    }
    const damageNumber = document.createElement('div');
    damageNumber.classList.add('fight-damage');
    damageNumber.innerHTML = `${damageArray.join("&nbsp;&nbsp;")}`;
    const iconImage = document.createElement('img');
    iconImage.src = `img/battle-icons/${actionType}.png`
    fightIcon.append(damageNumber);
    fightIcon.append(iconImage);

    battleDescription.classList.add('priority');
    fightOverlay.classList.remove('dnone');

    playAudio(audioName);

    fightBlockRow.addEventListener(
        'animationend',
        function () {
            battleDescription.classList.remove('priority');
            fightOverlay.classList.add('dnone');
            enableAI = true;
            activateBrain();
        },
        { once: true }
    );
}

function checkIfWon() {
    if (getRandomFoe() == 'Nothing') {
        gameWon();
        return;
    }
    if (getRandomHero() == 'Nothing') {
        gameOver();
        return;
    }

}