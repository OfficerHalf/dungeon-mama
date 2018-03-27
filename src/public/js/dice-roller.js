const diceButton = document.querySelector('#dicebtn');
const diceInput = document.querySelector('#diceinput');
// const addRollsToLogCheck = document.querySelector('#addRollsToLog');

function rollDice() {
    // TODO: Validate input
    const rolls = d20.roll(diceInput.value, true);
    const total = rolls.reduce((prev, current) => prev + current);
    console.log(total);
    // TODO: Show output
    // TODO: Add result to log
}

diceButton.addEventListener('click', rollDice);
