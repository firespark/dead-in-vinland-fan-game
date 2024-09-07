let difficulty = 'easy';

function settingsWarriorsInit() {
    Object.keys(warriorsObj).forEach(function (key) {

        const warriorSkillsNames = [];

        for (let i = 0; i < warriorsObj[key].skills.length; i++) {
            const element = warriorsObj[key].skills[i];
            warriorSkillsNames.push(skillsObj[element].name);
        }

        const warriorSkills = warriorSkillsNames.join(', ');

        const warriorDiv = document.createElement('div');
        warriorDiv.classList.add('warrior');
        warriorDiv.dataset.id = key;

        warriorDiv.innerHTML = `
                                <div class="warrior-wrapper">
                                    <div class="warrior-portrait">
                                        <img src="img/${warriorsObj[key].imgFolder}/portrait.png" alt="">
                                    </div>
                                    <div class="warrior-description">
                                        <div class="warrior-name">${warriorsObj[key].name}</div>
                                        <div class="warrior-features">
                                            <i>${warriorsObj[key].description}</i><br><br>
                                            Skills: ${warriorSkills}<br>
                                            Health: ${warriorsObj[key].hp}<br>
                                            Action points: ${warriorsObj[key].ap}<br>
                                            Strength: ${warriorsObj[key].strength}<br>
                                            Defense: ${warriorsObj[key].defense}<br>
                                            Aim: ${warriorsObj[key].aim}<br>
                                            Initiative: ${warriorsObj[key].initiative}<br>
                                        </div>
                                    </div>
                                </div>
        `;
        document.querySelector('.settings-warriors-wrapper').append(warriorDiv);

    });

}

function difficultyChoice() {
    const levelDivs = document.querySelectorAll('.level');
    levelDivs.forEach(element => {
        element.addEventListener('click', function () {
            levelDivs.forEach(level => {
                level.classList.remove('active');
            });
            this.classList.add('active');
            difficulty = this.dataset.level;
        });
    });
}

function settingsWarriorsAddOnClick() {
    const warriorDivs = document.querySelectorAll('.warrior');
    const submitButton = document.querySelector('.settings-submit-button');
    warriorDivs.forEach(element => {
        element.addEventListener('click', function () {

            warriorDivs.forEach(warrior => {
                warrior.classList.remove('disabled');
            });


            if (this.classList.contains('active')) {
                this.classList.remove('active');
                const index = selectedWarriors.indexOf(this.dataset.id);
                if (index > -1) {
                    selectedWarriors.splice(index, 1);
                }
            }
            else {
                selectedWarriors.push(this.dataset.id);
                this.classList.add('active');
                if (selectedWarriors.length == 3) {

                    warriorDivs.forEach(warrior => {
                        if (!warrior.classList.contains('active')) {
                            warrior.classList.add('disabled');
                        }
                    });
                }
            }

            if (selectedWarriors.length == 3) {
                submitButton.classList.remove('disabled');
            }
            else {
                if (!submitButton.classList.contains('disabled')) {
                    submitButton.classList.add('disabled');
                }
            }

        });
    });

}

function startGameButton() {
    const submitButton = document.querySelector('.settings-submit-button');

    submitButton.addEventListener('click', function () {
        if (!submitButton.classList.contains('disabled')) {
            document.querySelector('.settings-screen').classList.add('dnone');
            document.querySelector('.main-screen').classList.remove('dnone');

            document.querySelector('.battle-screen').style.backgroundImage = `url('img/bg/${getRandomInt(1, 13)}.png')`

            fillAllUnitList(selectedWarriors, difficulty);
            placeUnits();
            setUnitOrderBar();
            setStatusBar();
            resetHighlight();
            delay(2000).then(function () {
                gameEnded = false;
                //enableAI = true;
                highlightActive();
                activateBrain();
            });


        }
    });
}

