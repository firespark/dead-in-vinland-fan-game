const moveBtn = document.getElementById("move-unit");
const endTurnBtn = document.getElementById("end-turn");

moveBtn.addEventListener("click", function () {
    resetHighlight();
    moveUnit(activeUnit);
});

endTurnBtn.addEventListener("click", function () {
    resetHighlight();
    endTurn();
});
