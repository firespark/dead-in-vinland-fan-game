const statLinks = document.querySelectorAll('.stat-link');
const aboutLinks = document.querySelectorAll('.about-link');
const exitLinks = document.querySelectorAll('.exit-link');

const sScreen = document.querySelector('.settings-screen');
const mScreen = document.querySelector('.main-screen');
const stScreen = document.querySelector('.statistics-screen');
const aScreen = document.querySelector('.about-screen');
const nScreen = document.querySelector('.notice-overlay');

function checkQuitGame() {
    if (!mScreen.classList.contains('dnone') && nScreen.classList.contains('dnone')) {
        if (confirm('Are you sure you want to quit?') == true) {
            cleanUpEndGame();
            return true;
        }
        return false;
    }
    return true;
}

function changeScreen(screen) {
    if (!sScreen.classList.contains('dnone')) {
        sScreen.classList.add('dnone');
    }
    if (!mScreen.classList.contains('dnone')) {
        mScreen.classList.add('dnone');
    }
    if (!aScreen.classList.contains('dnone')) {
        aScreen.classList.add('dnone');
    }
    if (!stScreen.classList.contains('dnone')) {
        stScreen.classList.add('dnone');
    }
    screen.classList.remove('dnone');
}

function createStatisticsResults() {
    const statResults = localStorage.getItem('statCondition') ? JSON.parse(localStorage.getItem('statCondition')) : [];
    statResults.reverse();
    const statisticstable = document.querySelector('.statistics-table');

    statisticstable.innerHTML = '';

    let divRow = document.createElement('div');
    let divCell1 = document.createElement('div');
    let divCell2 = document.createElement('div');
    let divCell3 = document.createElement('div');

    divRow.classList.add('table-row', 'table-header');
    divCell1.classList.add('table-cell');
    divCell2.classList.add('table-cell');
    divCell3.classList.add('table-cell');

    divCell1.innerHTML = 'Date';
    divCell2.innerHTML = 'Level';
    divCell3.innerHTML = 'Result';

    divRow.append(divCell1);
    divRow.append(divCell2);
    divRow.append(divCell3);
    statisticstable.append(divRow);

    statResults.forEach(result => {
        let divRow = document.createElement('div');
        let divCell1 = document.createElement('div');
        let divCell2 = document.createElement('div');
        let divCell3 = document.createElement('div');

        divRow.classList.add('table-row');
        divCell1.classList.add('table-cell');
        divCell2.classList.add('table-cell');
        divCell3.classList.add('table-cell');

        divCell1.innerHTML = result.date;
        divCell2.innerHTML = result.level;
        divCell3.innerHTML = result.result == 'Won' ? '<img src="img/battle-icons/success.png">&nbsp;Won' : '<img src="img/battle-icons/death.png">&nbsp;Died';

        divRow.append(divCell1);
        divRow.append(divCell2);
        divRow.append(divCell3);
        statisticstable.append(divRow);
    });
}

statLinks.forEach(link => {
    link.addEventListener("click", function () {
        playAudio('click');
        if (checkQuitGame()) {
            document.querySelector('.notice-overlay').classList.add('dnone');
            document.querySelector('.notice-block.success').classList.add('dnone');
            changeScreen(stScreen);
        }
        document.querySelector('.notice-overlay').classList.add('dnone');
        document.querySelector('.notice-block.success').classList.add('dnone');
        createStatisticsResults();
    });
});

aboutLinks.forEach(link => {
    link.addEventListener("click", function () {
        playAudio('click');
        if (checkQuitGame()) {
            document.querySelector('.notice-overlay').classList.add('dnone');
            document.querySelector('.notice-block.success').classList.add('dnone');
            changeScreen(aScreen);
        }
    });
});

exitLinks.forEach(link => {
    link.addEventListener("click", function () {
        playAudio('click');
        if (checkQuitGame()) {
            document.querySelector('.notice-overlay').classList.add('dnone');
            document.querySelector('.notice-block.success').classList.add('dnone');
            changeScreen(sScreen);
        }
    });
});

