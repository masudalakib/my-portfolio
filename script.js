// Particle.js Configuration
particlesJS("particles-js", {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: false },
        size: { value: 3, random: true },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 6,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: true, mode: "repulse" },
            onclick: { enable: true, mode: "push" },
            resize: true
        }
    },
    retina_detect: true
});

// Initialize Vanilla Tilt
VanillaTilt.init(document.querySelectorAll(".project-card"), {
    max: 25,
    speed: 400,
    glare: true,
    "max-glare": 0.5,
});

// Typing Animation
const phrases = ["Web Developer", "Designer", "Creative Thinker"];
let currentPhrase = 0;
let currentChar = 0;
let isDeleting = false;
const typingSpeed = 100;
const deletingSpeed = 50;
const pauseEnd = 2000;

function typeText() {
    const typedTextElement = document.querySelector('.typed-text');
    const currentText = phrases[currentPhrase];
    
    if (isDeleting) {
        typedTextElement.textContent = currentText.substring(0, currentChar - 1);
        currentChar--;
    } else {
        typedTextElement.textContent = currentText.substring(0, currentChar + 1);
        currentChar++;
    }

    if (!isDeleting && currentChar === currentText.length) {
        isDeleting = true;
        setTimeout(typeText, pauseEnd);
        return;
    }

    if (isDeleting && currentChar === 0) {
        isDeleting = false;
        currentPhrase = (currentPhrase + 1) % phrases.length;
    }

    setTimeout(typeText, isDeleting ? deletingSpeed : typingSpeed);
}

// Start typing animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeText, 1000);
});

// Enhanced Tic Tac Toe Game Logic
const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const board = document.querySelector('.board');
const cellElements = document.querySelectorAll('[data-cell]');
const gameStatus = document.querySelector('.game-status');
const restartButton = document.getElementById('restartButton');
const modeBtns = document.querySelectorAll('.mode-btn');

let isOTurn = false;
let gameActive = true;
let isComputerMode = false;

// Game State
const gameState = {
    currentMode: 'pvp',
    scores: {
        player1: 0,
        player2: 0,
        ties: 0
    }
};

// Player Input Handling
const player1Input = document.getElementById('player1');
const player2Input = document.getElementById('player2');

function initializePlayerInputs() {
    [player1Input, player2Input].forEach(input => {
        // Add focus effects
        input.addEventListener('focus', function() {
            this.closest('.input-container').style.transform = 'scale(1.02)';
        });

        input.addEventListener('blur', function() {
            this.closest('.input-container').style.transform = 'scale(1)';
            validateAndUpdateName(this);
        });

        // Add input validation
        input.addEventListener('input', function() {
            validateAndUpdateName(this);
        });
    });
}

function validateAndUpdateName(input) {
    let name = input.value.trim();
    
    // Ensure name is not empty
    if (name === '') {
        name = input.id === 'player1' ? 'Player 1' : 'Player 2';
        input.value = name;
    }
    
    // Limit name length
    if (name.length > 15) {
        name = name.substring(0, 15);
        input.value = name;
    }
    
    // Update scoreboard and game status with new name
    updateScoreboard();
    updateGameStatus();
}

// Mode Selection
modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        gameState.currentMode = btn.dataset.mode;
        isComputerMode = gameState.currentMode === 'computer';
        
        // Update player 2 input based on mode
        if (isComputerMode) {
            player2Input.value = 'Computer';
            player2Input.disabled = true;
            player2Input.closest('.input-container').classList.add('computer-mode');
        } else {
            player2Input.value = 'Player 2';
            player2Input.disabled = false;
            player2Input.closest('.input-container').classList.remove('computer-mode');
        }
        
        updateScoreboard();
        startGame();
    });
});

// Score Management
const updateScoreboard = () => {
    const player1Name = player1Input.value.trim() || 'Player 1';
    const player2Name = player2Input.value.trim() || 'Player 2';
    
    document.querySelector('.player1-score .name').textContent = `${player1Name}:`;
    document.querySelector('.player2-score .name').textContent = `${player2Name}:`;
    document.querySelector('.player1-score .points').textContent = gameState.scores.player1;
    document.querySelector('.player2-score .points').textContent = gameState.scores.player2;
    document.querySelector('.ties .points').textContent = gameState.scores.ties;
};

const resetScores = () => {
    gameState.scores = {
        player1: 0,
        player2: 0,
        ties: 0
    };
    updateScoreboard();
};

document.getElementById('resetScoreButton').addEventListener('click', resetScores);

// Computer Move
const makeComputerMove = () => {
    const availableCells = Array.from(cellElements).filter(
        cell => !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS)
    );
    
    if (availableCells.length > 0) {
        // First try to win
        const winningMove = findBestMove(O_CLASS);
        if (winningMove !== -1) {
            const cell = cellElements[winningMove];
            return cell;
        }
        
        // Then try to block player
        const blockingMove = findBestMove(X_CLASS);
        if (blockingMove !== -1) {
            const cell = cellElements[blockingMove];
            return cell;
        }
        
        // If no winning or blocking move, try to take center
        if (!cellElements[4].classList.contains(X_CLASS) && 
            !cellElements[4].classList.contains(O_CLASS)) {
            return cellElements[4];
        }
        
        // Otherwise, make a random move
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        return availableCells[randomIndex];
    }
    return null;
};

const findBestMove = (playerClass) => {
    for (const combination of WINNING_COMBINATIONS) {
        const cells = combination.map(index => cellElements[index]);
        const playerCells = cells.filter(cell => 
            cell.classList.contains(playerClass)
        );
        const emptyCells = cells.filter(cell => 
            !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS)
        );
        
        if (playerCells.length === 2 && emptyCells.length === 1) {
            return combination[cells.indexOf(emptyCells[0])];
        }
    }
    return -1;
};

// Enhanced Game Status Update
function updateGameStatus() {
    const player1Name = player1Input.value.trim() || 'Player 1';
    const player2Name = player2Input.value.trim() || 'Player 2';
    gameStatus.textContent = `${isOTurn ? player2Name : player1Name}'s turn`;
    
    // Add visual indicator for current turn
    const activeInput = isOTurn ? player2Input : player1Input;
    const inactiveInput = isOTurn ? player1Input : player2Input;
    
    activeInput.closest('.input-container').classList.add('active-turn');
    inactiveInput.closest('.input-container').classList.remove('active-turn');
}

// Game Logic
function startGame() {
    isOTurn = false;
    gameActive = true;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
        
        // Remove any existing animations
        cell.style.animation = 'none';
        cell.offsetHeight; // Trigger reflow
        cell.style.animation = null;
    });
    
    setBoardHoverClass();
    updateGameStatus();
    updateScoreboard();
}

function handleClick(e) {
    if (!gameActive) return;
    
    const cell = e.target;
    if (cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS)) return;
    
    placeMark(cell, isOTurn ? O_CLASS : X_CLASS);
    
    if (checkWin(isOTurn ? O_CLASS : X_CLASS)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
        
        // Computer's turn
        if (isComputerMode && isOTurn && gameActive) {
            gameActive = false; // Prevent player from clicking during computer's turn
            setTimeout(() => {
                const computerCell = makeComputerMove();
                if (computerCell) {
                    placeMark(computerCell, O_CLASS);
                    if (checkWin(O_CLASS)) {
                        endGame(false);
                    } else if (isDraw()) {
                        endGame(true);
                    } else {
                        swapTurns();
                        setBoardHoverClass();
                        gameActive = true;
                    }
                }
            }, 500);
        }
    }
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    // Add pop animation
    cell.style.animation = 'pop 0.3s ease-out';
}

function swapTurns() {
    isOTurn = !isOTurn;
    updateGameStatus();
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);
    if (gameActive) {
        board.classList.add(isOTurn ? O_CLASS : X_CLASS);
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        const win = combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
        if (win) {
            // Add winning line animation
            drawWinningLine(combination);
        }
        return win;
    });
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

function endGame(draw) {
    gameActive = false;
    const player1Name = player1Input.value.trim() || 'Player 1';
    const player2Name = player2Input.value.trim() || 'Player 2';
    
    if (draw) {
        gameStatus.textContent = "It's a Draw!";
        gameState.scores.ties++;
    } else {
        const winner = isOTurn ? player2Name : player1Name;
        gameStatus.textContent = `${winner} Wins!`;
        if (isOTurn) {
            gameState.scores.player2++;
        } else {
            gameState.scores.player1++;
        }
        showWinningAnimation();
    }
    
    updateScoreboard();
}

function drawWinningLine(combination) {
    const startCell = cellElements[combination[0]].getBoundingClientRect();
    const endCell = cellElements[combination[2]].getBoundingClientRect();
    const boardRect = board.getBoundingClientRect();
    
    const line = document.createElement('div');
    line.classList.add('winning-line');
    
    const deltaX = endCell.left - startCell.left;
    const deltaY = endCell.top - startCell.top;
    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    
    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.left = `${startCell.left - boardRect.left + startCell.width / 2}px`;
    line.style.top = `${startCell.top - boardRect.top + startCell.height / 2}px`;
    
    board.appendChild(line);
}

function showWinningAnimation() {
    const wishDisplay = document.querySelector('.wish-display');
    wishDisplay.classList.add('show');
    
    // Create sparkles
    for (let i = 0; i < 30; i++) {
        createSparkle();
    }
    
    // Remove display after animation
    setTimeout(() => {
        wishDisplay.classList.remove('show');
    }, 5000);
}

function createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: white;
        border-radius: 50%;
        box-shadow: 0 0 10px white;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: sparkleAnim ${Math.random() * 2 + 1}s linear forwards;
        opacity: 0;
    `;
    
    document.querySelector('.sparkles').appendChild(sparkle);
    
    // Remove sparkle after animation
    setTimeout(() => sparkle.remove(), 3000);
}

// Add sparkle animation style
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkleAnim {
        0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
        }
        50% {
            opacity: 1;
        }
        100% {
            transform: translate(
                ${Math.random() > 0.5 ? '' : '-'}${Math.random() * 100}px,
                ${Math.random() > 0.5 ? '' : '-'}${Math.random() * 100}px
            ) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

restartButton.addEventListener('click', startGame);

// Initialize game
initializePlayerInputs();
updateScoreboard();
startGame();

// Enhanced Scroll Animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            if (entry.target.classList.contains('skill')) {
                animateSkills();
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('section').forEach(section => {
    section.classList.add('hidden');
    observer.observe(section);
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Mobile Navigation
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
    nav.classList.toggle('nav-active');
    
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
    
    burger.classList.toggle('toggle');
});

// Contact Form Handling
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form');
    const submitBtn = contactForm.querySelector('.submit-btn');
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Change button text to show loading
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Get form data
        const formData = {
            name: contactForm.querySelector('#name').value,
            email: contactForm.querySelector('#email').value,
            message: contactForm.querySelector('#message').value
        };
        
        try {
            
            
            //  using Formspree:
            const response = await fetch('https://formspree.io/f/mqaavjez', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                // Show success message
                showNotification('Message sent successfully!', 'success');
                contactForm.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            // Show error message
            showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    });
});

// Notification System
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Create message container
    const messageContainer = document.createElement('div');
    messageContainer.className = 'notification-message';
    messageContainer.textContent = message;
    
    // Create icon based on type
    const icon = document.createElement('i');
    icon.className = `fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`;
    
    // Assemble notification
    notification.appendChild(icon);
    notification.appendChild(messageContainer);
    
    // Add to document
    document.body.appendChild(notification);
    
    // Add show class for animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove notification after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Form Submission
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Add your form submission logic here
    alert('Thank you for your message! I will get back to you soon.');
    contactForm.reset();
});

// Header Scroll Effect
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Skill bars animation
function animateSkills() {
    const skills = document.querySelectorAll('.skill');
    skills.forEach(skill => {
        const progressBar = skill.querySelector('.progress');
        const width = progressBar.style.width;
        progressBar.style.width = '0';
        setTimeout(() => {
            progressBar.style.width = width;
        }, 200);
    });
}

// Animate skills when scrolling into view
const aboutSection = document.querySelector('#about');
const observerSkills = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkills();
            observerSkills.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

observerSkills.observe(aboutSection);
