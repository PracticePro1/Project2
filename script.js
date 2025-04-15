// Quiz Game Variables
let quizzes = [];
let currentQuiz = null;
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];

// Load quizzes when page loads
window.onload = function() {
    fetch('quizzes.json')
        .then(response => response.json())
        .then(data => {
            quizzes = data.quizzes;
            showQuizList();
        });
};

function showQuizList() {
    document.getElementById('quiz-container').innerHTML = `
        <h1>Grade 2 Learning Quizzes</h1>
        <p class="subtitle">Choose a quiz to begin!</p>
        <div id="quiz-list" class="quiz-grid"></div>
    `;
    
    const quizList = document.getElementById('quiz-list');
    quizList.innerHTML = '';
    
    quizzes.forEach(quiz => {
        quizList.innerHTML += `
            <div class="quiz-card">
                <h2>${quiz.title}</h2>
                <p>${quiz.description}</p>
                <p><small>${quiz.questions.length} questions</small></p>
                <button onclick="startQuiz('${quiz.id}')">Start Quiz</button>
            </div>
        `;
    });
}

function startQuiz(quizId) {
    currentQuiz = quizzes.find(q => q.id === quizId);
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    showQuestion();
}

function showQuestion() {
    const question = currentQuiz.questions[currentQuestionIndex];
    
    let optionsHTML = '';
    question.options.forEach((option, index) => {
        optionsHTML += `
            <label class="option">
                <input type="radio" name="answer" value="${index}">
                <span class="option-text">${option}</span>
            </label>
        `;
    });
    
    document.getElementById('quiz-container').innerHTML = `
        <div class="quiz-area">
            <div class="progress">Question ${currentQuestionIndex + 1} of ${currentQuiz.questions.length}</div>
            <h2>${question.question}</h2>
            <form id="quiz-form">
                ${optionsHTML}
                <button type="button" class="submit-btn" onclick="checkAnswer()">Submit Answer</button>
            </form>
        </div>
    `;
}

function checkAnswer() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (!selectedOption) {
        alert("Please select an answer!");
        return;
    }
    
    const userAnswer = parseInt(selectedOption.value);
    const correctAnswer = currentQuiz.questions[currentQuestionIndex].answer;
    const isCorrect = userAnswer === correctAnswer;
    
    userAnswers.push({
        question: currentQuiz.questions[currentQuestionIndex].question,
        userAnswer: userAnswer,
        correctAnswer: correctAnswer,
        explanation: currentQuiz.questions[currentQuestionIndex].explanation,
        isCorrect: isCorrect
    });
    
    if (isCorrect) {
        score++;
    }
    
    showFeedback();
}

function showFeedback() {
    const currentQ = currentQuiz.questions[currentQuestionIndex];
    const userAnswerObj = userAnswers[currentQuestionIndex];
    
    let optionsHTML = '';
    currentQ.options.forEach((option, index) => {
        let className = '';
        if (index === currentQ.answer) {
            className = 'correct-answer';
        } else if (index === userAnswerObj.userAnswer && !userAnswerObj.isCorrect) {
            className = 'wrong-answer';
        }
        
        optionsHTML += `
            <div class="feedback-option ${className}">
                ${option}
                ${index === currentQ.answer ? '✓' : ''}
            </div>
        `;
    });
    
    document.getElementById('quiz-container').innerHTML = `
        <div class="feedback-area">
            <h2>${userAnswerObj.isCorrect ? '✅ Correct!' : '❌ Oops!'}</h2>
            <p class="explanation">${currentQ.explanation}</p>
            
            <div class="answers-review">
                ${optionsHTML}
            </div>
            
            <button class="next-btn" onclick="nextQuestion()">
                ${currentQuestionIndex < currentQuiz.questions.length - 1 ? 'Next Question' : 'See Results'}
            </button>
        </div>
    `;
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuiz.questions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    const percentage = Math.round((score / currentQuiz.questions.length) * 100);
    let message = '';
    
    if (percentage === 100) {
        message = "🌟 Perfect! You're a superstar! 🌟";
    } else if (percentage >= 80) {
        message = "🎉 Excellent job! You're really smart! 🎉";
    } else if (percentage >= 60) {
        message = "👍 Good work! Keep practicing! 👍";
    } else {
        message = "💪 Nice try! You'll do better next time! 💪";
    }
    
    document.getElementById('quiz-container').innerHTML = `
        <div class="results-area">
            <h1>Quiz Complete!</h1>
            <div class="score-circle">
                <span class="score">${score}/${currentQuiz.questions.length}</span>
            </div>
            <h2 class="message">${message}</h2>
            
            <button class="retry-btn" onclick="startQuiz('${currentQuiz.id}')">
                Try Again
            </button>
            <button class="home-btn" onclick="showQuizList()">
                Choose Another Quiz
            </button>
        </div>
    `;
}