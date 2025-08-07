// Global variables
let currentQuestionIndex = 1;
const totalQuestions = 8;

// Function to start the survey
function startSurvey() {
    window.location.href = 'survey.html';
}

// Function to update progress bar
function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const currentQuestionSpan = document.getElementById('currentQuestion');
    const percentage = (currentQuestionIndex / totalQuestions) * 100;
    
    if (progressFill) {
        progressFill.style.width = percentage + '%';
    }
    
    if (currentQuestionSpan) {
        currentQuestionSpan.textContent = currentQuestionIndex;
    }
}

// Function to show specific question
function showQuestion(questionNumber) {
    // Hide all questions
    const allQuestions = document.querySelectorAll('.question-card');
    allQuestions.forEach(card => {
        card.classList.remove('active');
    });
    
    // Show current question
    const currentQuestion = document.querySelector(`[data-question="${questionNumber}"]`);
    if (currentQuestion) {
        currentQuestion.classList.add('active');
    }
    
    // Update navigation buttons
    updateNavigationButtons();
    updateProgress();
}

// Function to update navigation buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    if (prevBtn) {
        prevBtn.style.display = currentQuestionIndex === 1 ? 'none' : 'block';
    }
    
    if (nextBtn && submitBtn) {
        if (currentQuestionIndex === totalQuestions) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
    }
}

// Function to change question
function changeQuestion(direction) {
    const newQuestionIndex = currentQuestionIndex + direction;
    
    // Validate question bounds
    if (newQuestionIndex < 1 || newQuestionIndex > totalQuestions) {
        return;
    }
    
    // Check if current question is answered (for required questions)
    if (direction > 0 && !isCurrentQuestionAnswered()) {
        showValidationMessage();
        return;
    }
    
    currentQuestionIndex = newQuestionIndex;
    showQuestion(currentQuestionIndex);
}

// Function to check if current question is answered
function isCurrentQuestionAnswered() {
    const currentQuestion = document.querySelector(`[data-question="${currentQuestionIndex}"]`);
    
    if (!currentQuestion) return true;
    
    // Check for radio buttons
    const radioInputs = currentQuestion.querySelectorAll('input[type="radio"]');
    if (radioInputs.length > 0) {
        return Array.from(radioInputs).some(input => input.checked);
    }
    
    // Check for checkboxes (at least one should be checked for pet types question)
    const checkboxInputs = currentQuestion.querySelectorAll('input[type="checkbox"]');
    if (checkboxInputs.length > 0 && currentQuestionIndex === 2) {
        return Array.from(checkboxInputs).some(input => input.checked);
    }
    
    // For text areas and other questions, they're optional
    return true;
}

// Function to show validation message
function showValidationMessage() {
    // Create and show a temporary validation message
    const existingMessage = document.querySelector('.validation-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const message = document.createElement('div');
    message.className = 'validation-message';
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #ff6b9d, #ff8e8e);
        color: white;
        padding: 1rem 2rem;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(255, 107, 157, 0.3);
        z-index: 1000;
        font-weight: 600;
        text-align: center;
        animation: shake 0.5s ease-in-out;
    `;
    message.textContent = 'Please answer this question before continuing! 🐾';
    
    document.body.appendChild(message);
    
    // Add shake animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translate(-50%, -50%) translateX(0); }
            25% { transform: translate(-50%, -50%) translateX(-10px); }
            75% { transform: translate(-50%, -50%) translateX(10px); }
        }
    `;
    document.head.appendChild(style);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        message.remove();
        style.remove();
    }, 3000);
}

// Function to handle form submission
function handleFormSubmission(event) {
    event.preventDefault();
    
    // Collect form data
    const formData = new FormData(event.target);
    const responses = {};
    
    // Process form data
    for (let [key, value] of formData.entries()) {
        if (responses[key]) {
            // Handle multiple values (checkboxes)
            if (Array.isArray(responses[key])) {
                responses[key].push(value);
            } else {
                responses[key] = [responses[key], value];
            }
        } else {
            responses[key] = value;
        }
    }
    
    // Log responses (in a real app, you'd send this to a server)
    console.log('Survey Responses:', responses);
    
    // Show thank you message
    document.querySelector('.survey-form').style.display = 'none';
    document.getElementById('thankYouMessage').style.display = 'block';
    
    // Add confetti effect
    createConfetti();
}

// Function to create confetti effect
function createConfetti() {
    const colors = ['#ff6b9d', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#fab1a0'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                top: -10px;
                left: ${Math.random() * 100}%;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                animation: confettiFall 3s linear forwards;
            `;
            
            document.body.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 100);
    }
    
    // Add confetti animation
    if (!document.querySelector('#confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.textContent = `
            @keyframes confettiFall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Function to restart survey
function restartSurvey() {
    window.location.href = 'index.html';
}

// Initialize the survey page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the survey page
    if (document.querySelector('.survey-page')) {
        // Initialize first question
        showQuestion(1);
        
        // Add form submission handler
        const form = document.getElementById('petSurveyForm');
        if (form) {
            form.addEventListener('submit', handleFormSubmission);
        }
        
        // Add keyboard navigation
        document.addEventListener('keydown', function(event) {
            if (event.key === 'ArrowLeft' && currentQuestionIndex > 1) {
                changeQuestion(-1);
            } else if (event.key === 'ArrowRight' && currentQuestionIndex < totalQuestions) {
                if (isCurrentQuestionAnswered()) {
                    changeQuestion(1);
                } else {
                    showValidationMessage();
                }
            }
        });
        
        // Add click handlers for options to auto-advance (for radio buttons)
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', function() {
                // Auto-advance after a short delay for better UX
                setTimeout(() => {
                    if (currentQuestionIndex < totalQuestions) {
                        changeQuestion(1);
                    }
                }, 500);
            });
        });
    }
    
    // Add hover effects to gallery pets on welcome page
    if (document.querySelector('.welcome-page')) {
        const galleryPets = document.querySelectorAll('.gallery-pet');
        galleryPets.forEach(pet => {
            pet.addEventListener('click', function() {
                // Add a fun click effect
                this.style.transform = 'scale(1.5) rotate(360deg)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 600);
            });
        });
    }
});

// Add some fun interactions
document.addEventListener('DOMContentLoaded', function() {
    // Add click sound effect (visual feedback)
    document.addEventListener('click', function(event) {
        if (event.target.matches('button, .option, .gallery-pet')) {
            // Create a ripple effect
            const ripple = document.createElement('div');
            const rect = event.target.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                pointer-events: none;
                animation: ripple 0.6s ease-out;
            `;
            
            event.target.style.position = 'relative';
            event.target.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        }
    });
    
    // Add ripple animation
    if (!document.querySelector('#ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            @keyframes ripple {
                from {
                    transform: scale(0);
                    opacity: 1;
                }
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
});
