let clickCount = 0;
let counter = 0;
let autoAdvanceTimer = null;
let countdownInterval = null;
let countdownSeconds = 60;

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
    "3. Eliminate",
    "4. Innovate"
];

const instructionsElement = document.getElementById('instructions');
const counterElement = document.getElementById('counter');
const nextButton = document.getElementById('nextButton');
const themeAudio = document.getElementById('themeAudio');

function clearAutoAdvanceTimer() {
    if (autoAdvanceTimer) {
        clearTimeout(autoAdvanceTimer);
        autoAdvanceTimer = null;
    }
}

function clearCountdownInterval() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
}

function startCountdown() {
    countdownSeconds = 60;
    updateCountdownDisplay();
    
    countdownInterval = setInterval(() => {
        countdownSeconds--;
        updateCountdownDisplay();
        
        if (countdownSeconds <= 0) {
            clearCountdownInterval();
        }
    }, 1000);
}

function updateCountdownDisplay() {
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        countdownElement.textContent = countdownSeconds;
    }
}

function showCollaborateStep() {
    instructionsElement.innerHTML = `
        <div class="collaborate-text">${simpleInstructions[0]}</div>
        <div class="countdown-container">
            <div class="countdown-label">Time remaining:</div>
            <div class="countdown" id="countdown">60</div>
        </div>
    `;
    instructionsElement.classList.add('simple-text');
    startCountdown();
    
    // Start playing theme music
    if (themeAudio) {
        themeAudio.play().catch(error => {
            console.log('Audio play failed:', error);
        });
    }
    
    // Auto-advance after 60 seconds
    autoAdvanceTimer = setTimeout(() => {
        advanceToNextStep();
    }, 60000);
}

function advanceToNextStep() {
    clearAutoAdvanceTimer();
    clearCountdownInterval();
    
    // Stop theme music when leaving collaborate state
    if (themeAudio && clickCount === 1) {
        themeAudio.pause();
        themeAudio.currentTime = 0;
    }
    
    clickCount++;
    
    if (clickCount === 1) {
        showCollaborateStep();
    } else if (clickCount === 2) {
        instructionsElement.innerHTML = simpleInstructions[1];
        instructionsElement.classList.add('simple-text');
    } else if (clickCount === 3) {
        instructionsElement.innerHTML = simpleInstructions[2];
        instructionsElement.classList.add('simple-text');
    } else if (clickCount === 4) {
        instructionsElement.innerHTML = simpleInstructions[3];
        instructionsElement.classList.add('simple-text');
    } else if (clickCount === 5) {
        counter++;
        counterElement.textContent = counter;
        clickCount = 1;
        showCollaborateStep();
    }
}

nextButton.addEventListener('click', () => {
    advanceToNextStep();
});

