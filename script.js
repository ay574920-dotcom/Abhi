document.addEventListener('DOMContentLoaded', function() {
    // --- STATE MANAGEMENT ---
    let isLoggedIn = false;

    // --- DOM ELEMENTS ---
    const pages = document.querySelectorAll('main > section');
    const navLinks = document.querySelectorAll('.nav-link');
    const navLogin = document.getElementById('nav-login');
    const navLogout = document.getElementById('nav-logout');
    const navSurvey = document.getElementById('nav-survey');
    const navLinksPage = document.getElementById('nav-links');
    const navAI = document.getElementById('nav-ai');
    const navContact = document.getElementById('nav-contact'); // Added this line
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const surveyForm = document.getElementById('survey-form');
    const surveyResult = document.getElementById('survey-result');
    const showRegisterLink = document.getElementById('show-register-link');
    const showLoginLink = document.getElementById('show-login-link');
    const contactForm = document.getElementById('contact-form');
    const aiChatForm = document.getElementById('ai-chat-form');
    const aiChatInput = document.getElementById('ai-chat-input');
    const aiChatMessages = document.getElementById('ai-chat-messages');

    
    // --- FUNCTIONS ---

    function showPage(pageId) {
        pages.forEach(page => page.classList.remove('active'));
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${pageId}`);
        });
    }

    function updateLoginState() {
        if (isLoggedIn) {
            navLogin.classList.add('hidden');
            navLogout.classList.remove('hidden');
            navSurvey.classList.remove('hidden');
            navLinksPage.classList.remove('hidden');
            navAI.classList.remove('hidden');
            navContact.classList.remove('hidden'); // Modified this
        } else {
            navLogin.classList.remove('hidden');
            navLogout.classList.add('hidden');
            navSurvey.classList.add('hidden');
            navLinksPage.classList.add('hidden');
            navAI.classList.add('hidden');
            navContact.classList.add('hidden'); // Modified this
            showPage('home');
        }
    }
    
    // --- EVENT LISTENERS ---
    
    document.querySelector('#nav-login a').addEventListener('click', function(event) {
        event.preventDefault();
        showPage('login');
    });

    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('register');
    });
    
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('login');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const pageId = this.getAttribute('href').substring(1);
            showPage(pageId);
        });
    });

    navLogout.addEventListener('click', function(event) {
        event.preventDefault();
        isLoggedIn = false;
        updateLoginState();
    });

    // Handle login form submission using localStorage
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = loginForm.querySelector('#login-username').value.trim();
        const password = loginForm.querySelector('#login-password').value.trim();
        const errorElement = document.getElementById('login-error');

        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('cybersecure-users')) || {};

        // Check if user exists and password is correct
        if (users[username] && users[username] === password) {
            isLoggedIn = true;
            updateLoginState();
            showPage('survey');
            loginForm.reset();
            errorElement.textContent = '';
        } else {
            errorElement.textContent = 'Invalid username or password. Please try again.';
        }
    });

    // Handle register form submission
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = registerForm.querySelector('#register-username').value.trim();
        const password = registerForm.querySelector('#register-password').value.trim();
        const messageElement = document.getElementById('register-message');
        
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('cybersecure-users')) || {};

        if (users[username]) {
            messageElement.textContent = 'Username already exists. Please choose another one.';
            messageElement.style.color = '#f87171'; // Red
        } else if (password.length < 6) {
            messageElement.textContent = 'Password must be at least 6 characters long.';
            messageElement.style.color = '#f87171'; // Red
        } else {
            // Add new user
            users[username] = password;
            // Save back to localStorage
            localStorage.setItem('cybersecure-users', JSON.stringify(users));
            
            messageElement.textContent = 'Registration successful! You can now log in.';
            messageElement.style.color = '#34d399'; // Green
            registerForm.reset();

            setTimeout(() => {
                showPage('login');
                messageElement.textContent = '';
            }, 2000);
        }
    });
    
    // --- SURVEY LOGIC ---
    const surveyQuestions = document.querySelectorAll('.survey-question');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const prevQuestionBtn = document.getElementById('prev-question-btn');
    const progressBar = document.getElementById('progress-bar');
    let currentQuestionIndex = 0;

    function showQuestion(index) {
        surveyQuestions.forEach((question, i) => {
            question.classList.toggle('active', i === index);
        });
        const progress = ((index + 1) / surveyQuestions.length) * 100;
        progressBar.style.width = `${progress}%`;
        nextQuestionBtn.textContent = (index === surveyQuestions.length - 1) ? 'Submit Survey' : 'Next Question';
        
        // Show or hide the 'Previous' button
        prevQuestionBtn.classList.toggle('hidden', index === 0);
    }

    nextQuestionBtn.addEventListener('click', function() {
        const currentQuestion = surveyQuestions[currentQuestionIndex];
        const selectedAnswer = currentQuestion.querySelector('input[type="radio"]:checked');
        
        if (!selectedAnswer) {
            surveyResult.textContent = 'Please select an answer.';
            surveyResult.style.color = '#f87171';
            setTimeout(() => surveyResult.textContent = '', 2000);
            return;
        }

        if (currentQuestionIndex === surveyQuestions.length - 1) {
            surveyResult.textContent = 'Thank you for completing the survey!';
            surveyResult.style.color = '#34d399';
            nextQuestionBtn.disabled = true;
            
            setTimeout(() => {
                surveyResult.textContent = '';
                currentQuestionIndex = 0;
                document.querySelectorAll('#survey-form input[type="radio"]').forEach(radio => radio.checked = false);
                showQuestion(currentQuestionIndex);
                nextQuestionBtn.disabled = false;
            }, 4000);
        } else {
            currentQuestionIndex++;
            showQuestion(currentQuestionIndex);
        }
    });

    prevQuestionBtn.addEventListener('click', function() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuestion(currentQuestionIndex);
        }
    });

    surveyForm.addEventListener('submit', e => e.preventDefault());

    // --- CONTACT FORM LOGIC ---
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const status = document.getElementById('contact-form-status');
        status.textContent = 'Thank you for your message!';
        status.style.color = '#34d399'; // Green
        contactForm.reset();
        setTimeout(() => {
            status.textContent = '';
        }, 4000);
    });
    
    // --- AI CHATBOT LOGIC ---
    aiChatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const userInput = aiChatInput.value.trim();
        if (userInput === '') return;

        // Add user message to chat
        addChatMessage(userInput, 'user');
        aiChatInput.value = '';

        // Get AI response after a short delay
        setTimeout(() => {
            const aiResponse = getAIResponse(userInput);
            addChatMessage(aiResponse, 'ai');
        }, 800);
    });

    function addChatMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.classList.add('chat-message', sender === 'user' ? 'user-message' : 'ai-message');
        aiChatMessages.appendChild(messageDiv);
        // Scroll to the bottom
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    }

    function getAIResponse(input) {
        const lowerInput = input.toLowerCase();

        if (lowerInput.includes('phishing')) {
            return "Phishing is a fraudulent attempt to obtain sensitive information such as usernames, passwords, and credit card details by disguising as a trustworthy entity in an electronic communication, like an email. Always be cautious of unsolicited emails asking for personal info.";
        } else if (lowerInput.includes('password')) {
            return "A strong password should be long (at least 12 characters), complex (include uppercase, lowercase, numbers, and symbols), and unique for each account. Consider using a password manager to help create and store them securely.";
        } else if (lowerInput.includes('malware')) {
            return "Malware, short for malicious software, is any software intentionally designed to cause damage to a computer, server, client, or computer network. Types include viruses, worms, Trojan horses, ransomware, and spyware.";
        } else if (lowerInput.includes('2fa') || lowerInput.includes('two factor')) {
            return "Two-Factor Authentication (2FA) is a security layer that requires you to provide two different authentication factors to verify yourself. It adds a crucial second step to your login process to prevent unauthorized access.";
        } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
            return "Hello! How can I help you with your cybersecurity questions today?";
        } else {
            return "I'm sorry, I can only answer basic questions about phishing, passwords, malware, and 2FA right now. Please try asking about one of those topics.";
        }
    }
    
    // --- INITIALIZATION ---
    showPage('home');
    updateLoginState();
    showQuestion(0);
});
