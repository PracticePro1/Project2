// This will make your quizzes work properly
let quizzes = [];
let currentQuiz = null;
let currentQuestionIndex = 0;
let score = 0;

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
        <h1>Choose a Quiz</h1>
        <div id="quiz-list"></div>
    `;
    
    const quizList = document.getElementById('quiz-list');
    quizList.innerHTML = '';
    
    quizzes.forEach(quiz => {
        quizList.innerHTML += `
            <div class="quiz-card">
                <h2>${quiz.title}</h2>
                <p>${quiz.description}</p>
                <button onclick="startQuiz('${quiz.id}')">Start Quiz</button>
            </div>
        `;
    });
}

function startQuiz(quizId) {
    currentQuiz = quizzes.find(q => q.id === quizId);
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
}

function showQuestion() {
    const question = currentQuiz.questions[currentQuestionIndex];
    
    let optionsHTML = '';
    question.options.forEach((option, index) => {
        optionsHTML += `
            <label class="option">
                <input type="radio" name="answer" value="${index}">
                ${option}
            </label>
        `;
    });
    
    document.getElementById('quiz-container').innerHTML = `
        <div class="quiz-area">
            <h2>${currentQuiz.title}</h2>
            <div class="question-count">Question ${currentQuestionIndex + 1} of ${currentQuiz.questions.length}</div>
            <div class="question">${question.question}</div>
            <form id="quiz-form">
                ${optionsHTML}
                <button type="button" onclick="checkAnswer()">Submit Answer</button>
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
    
    if (userAnswer === correctAnswer) {
        score++;
    }
    
    currentQuestionIndex++;
    
    if (currentQuestionIndex < currentQuiz.questions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    document.getElementById('quiz-container').innerHTML = `
        <div class="results">
            <h2>Quiz Complete!</h2>
            <p>Your score: ${score} out of ${currentQuiz.questions.length}</p>
            <button onclick="showQuizList()">Back to Quizzes</button>
        </div>
    `;
}