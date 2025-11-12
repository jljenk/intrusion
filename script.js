let clickCount = 0;
let counter = 0;

const initialInstructionsHTML = `
    <div class="welcome-title">Welcome to intrusion</div>
    <div class="rules-section">
        <div class="section-title">Rules</div>
        <ul class="rules-list">
            <li>Don't view another person's screen or card.</li>
            <li>Keep your eyes closed when instructed.</li>
            <li>Only perform the detection method the group agreed on.</li>
            <li>Pass on the ball immediately.</li>
        </ul>
    </div>
    <div class="getting-started-section">
        <div class="section-title">Getting started</div>
        <ol class="getting-started-list">
            <li>Distribute cards.</li>
            <li>Join the Slack group.</li>
            <li>Close your eyes when materials are passed out.</li>
        </ol>
    </div>
`;

const simpleInstructions = [
    "1. Collaborate",
    "2. Operate",
    "3. Eliminate"
];

const instructionsElement = document.getElementById('instructions');
const counterElement = document.getElementById('counter');
const nextButton = document.getElementById('nextButton');

nextButton.addEventListener('click', () => {
    clickCount++;
    
    if (clickCount === 1) {
        instructionsElement.innerHTML = simpleInstructions[0];
        instructionsElement.classList.add('simple-text');
    } else if (clickCount === 2) {
        instructionsElement.innerHTML = simpleInstructions[1];
        instructionsElement.classList.add('simple-text');
    } else if (clickCount === 3) {
        instructionsElement.innerHTML = simpleInstructions[2];
        instructionsElement.classList.add('simple-text');
    } else if (clickCount === 4) {
        counter++;
        counterElement.textContent = counter;
        clickCount = 1;
        instructionsElement.innerHTML = simpleInstructions[0];
        instructionsElement.classList.add('simple-text');
    }
});

