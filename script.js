let clickCount = 0;
let counter = 0;
let autoAdvanceTimer = null;
let countdownInterval = null;
let countdownSeconds = 60;
let gameOver = false;

// Get max dwell time from URL parameter
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

const maxDwellTime = parseInt(getURLParameter('dt')) || null;

const initialInstructionsHTML = `
    <div class="welcome-title">Welcome to intrusion</div>
    <div class="rules-section">
        <div class="section-title">Rules</div>
        <ul class="rules-list">
            <li>Don't view another person's screen or card.</li>
            <li>Keep your eyes closed when instructed.</li>
            <li>Stay seated and avoid physical contact with others when identifying threats.</li>
            <li>Pass on the ball immediately.</li>
            <li>At least half of the hackers must send a hack each round. Any given hacker must infect a ball at least every other round.</li>
        </ul>
    </div>
    <div class="getting-started-section">
        <div class="section-title">Getting started</div>
        <ol class="getting-started-list">
            <li>Distribute cards.</li>
            <li>Join (only) your Slack group.</li>
            <li>Close your eyes when materials are passed out.</li>
        </ol>
    </div>
    <br>
    <div class="how-to-win-section">
        <div class="guide-content">
            <p><strong>Intrusion detection specialists win if either:</strong></p>
            <ul class="rules-list">
                <li>No hacker infects any packet on more than one round — or</li>
                <li>All hackers are identified and removed from the game.</li>
            </ul>
            <p><strong>Hackers win if:</strong></p>
            <ul class="rules-list">
                <li>Dwell time reaches the configured maximum (dt) — the system shows "System Compromised."</li>
            </ul>
        </div>
    </div>
`;

const simpleInstructions = [
    "1. Collaborate",
    "2. Operate",
    "3. Eliminate",
    "4. Innovate",
    "5. Increment"
];

const instructionsElement = document.getElementById('instructions');
const counterElement = document.getElementById('counter');
const nextButton = document.getElementById('nextButton');
const previousButton = document.getElementById('previousButton');
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
    if (gameOver) return;
    
    instructionsElement.innerHTML = `
        <div class="collaborate-text">${simpleInstructions[0]}</div>
        <div class="countdown-container">
            <div class="countdown-label">Time remaining:</div>
            <div class="countdown" id="countdown">60</div>
        </div>
    `;
    instructionsElement.classList.add('simple-text');
    startCountdown();
    updatePreviousButtonVisibility();
    
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

function showSystemCompromised() {
    gameOver = true;
    clearAutoAdvanceTimer();
    clearCountdownInterval();
    
    // Stop theme music if playing
    if (themeAudio) {
        themeAudio.pause();
        themeAudio.currentTime = 0;
    }
    
    // Hide buttons
    if (nextButton) nextButton.style.display = 'none';
    if (previousButton) previousButton.style.display = 'none';
    
    // Show system compromised message
    const compromisedOverlay = document.createElement('div');
    compromisedOverlay.id = 'compromisedOverlay';
    compromisedOverlay.className = 'compromised-overlay';
    compromisedOverlay.innerHTML = '<div class="compromised-text">SYSTEM COMPROMISED</div>';
    document.body.appendChild(compromisedOverlay);
}

function incrementCounter() {
    counter++;
    counterElement.textContent = counter;
    // Add animation class
    counterElement.classList.add('counter-increment');
    // Remove animation class after animation completes
    setTimeout(() => {
        counterElement.classList.remove('counter-increment');
    }, 600);
    
    // Check if max dwell time reached
    if (maxDwellTime !== null && counter >= maxDwellTime) {
        setTimeout(() => {
            showSystemCompromised();
        }, 600);
    }
}

function updatePreviousButtonVisibility() {
    if (previousButton) {
        if (clickCount === 0) {
            previousButton.style.display = 'none';
            // Center the Next button when Previous is hidden
            if (nextButton) {
                nextButton.classList.add('centered');
            }
        } else {
            previousButton.style.display = 'block';
            // Move Next button back to its normal position
            if (nextButton) {
                nextButton.classList.remove('centered');
            }
        }
    }
}

function showInitialInstructions() {
    clearAutoAdvanceTimer();
    clearCountdownInterval();
    
    // Stop theme music if playing
    if (themeAudio) {
        themeAudio.pause();
        themeAudio.currentTime = 0;
    }
    
    instructionsElement.innerHTML = initialInstructionsHTML;
    instructionsElement.classList.remove('simple-text');
    clickCount = 0;
    updatePreviousButtonVisibility();
}

function showState(stateNumber, shouldIncrement = false) {
    clearAutoAdvanceTimer();
    clearCountdownInterval();
    
    if (stateNumber === 1) {
        showCollaborateStep();
    } else if (stateNumber === 2) {
        instructionsElement.innerHTML = simpleInstructions[1];
        instructionsElement.classList.add('simple-text');
        updatePreviousButtonVisibility();
    } else if (stateNumber === 3) {
        instructionsElement.innerHTML = simpleInstructions[2];
        instructionsElement.classList.add('simple-text');
        updatePreviousButtonVisibility();
    } else if (stateNumber === 4) {
        instructionsElement.innerHTML = simpleInstructions[3];
        instructionsElement.classList.add('simple-text');
        updatePreviousButtonVisibility();
    } else if (stateNumber === 5) {
        instructionsElement.innerHTML = simpleInstructions[4];
        instructionsElement.classList.add('simple-text');
        updatePreviousButtonVisibility();
        // Only increment if we're advancing forward
        if (shouldIncrement) {
            incrementCounter();
        }
    }
}

function advanceToNextStep() {
    if (gameOver) return;
    
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
        showState(2);
    } else if (clickCount === 3) {
        showState(3);
    } else if (clickCount === 4) {
        showState(4);
    } else if (clickCount === 5) {
        showState(5, true); // Increment counter when advancing forward to state 5
    } else if (clickCount === 6) {
        clickCount = 1;
        showCollaborateStep();
    }
}

function goToPreviousStep() {
    if (gameOver) return;
    
    clearAutoAdvanceTimer();
    clearCountdownInterval();
    
    // Stop theme music if playing
    if (themeAudio && clickCount === 1) {
        themeAudio.pause();
        themeAudio.currentTime = 0;
    }
    
    if (clickCount > 1) {
        clickCount--;
        showState(clickCount, false); // Don't increment when going back
    } else if (clickCount === 1) {
        showInitialInstructions();
    }
    // If clickCount === 0 (initial state), do nothing or wrap to end
    // For now, do nothing at initial state
}

nextButton.addEventListener('click', () => {
    advanceToNextStep();
});

previousButton.addEventListener('click', () => {
    goToPreviousStep();
});

// Keyboard navigation
document.addEventListener('keydown', (event) => {
    if (gameOver) return;
    
    if (event.key === 'ArrowRight') {
        event.preventDefault();
        if (clickCount === 0) {
            // Start from initial state
            advanceToNextStep();
        } else {
            advanceToNextStep();
        }
    } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToPreviousStep();
    }
});

// Hide Previous button on initial page load
updatePreviousButtonVisibility();

