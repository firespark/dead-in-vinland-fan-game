const moveBtn = document.getElementById("move-unit");
const endTurnBtn = document.getElementById("end-turn");

moveBtn.addEventListener("click", function () {
    resetHighlight();
    playAudio('skill');
    skillsObj['move'].use(activeUnit);
});

endTurnBtn.addEventListener("click", function () {
    resetHighlight();
    playAudio('skill');
    endTurn();
});
