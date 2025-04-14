// Load quizzes
fetch('quizzes.json')
    .then(response => response.json())
    .then(data => {
        const quizList = document.getElementById('quiz-list');
        
        data.quizzes.forEach(quiz => {
            const quizElement = document.createElement('div');
            quizElement.className = 'quiz';
            quizElement.innerHTML = `
                <h2>${quiz.title}</h2>
                <p>${quiz.description}</p>
                <p>Number of questions: ${quiz.questions.length}</p>
                <button onclick="startQuiz('${quiz.id}')">Start Quiz</button>
            `;
            quizList.appendChild(quizElement);
        });
    });

function startQuiz(quizId) {
    // For now just alert which quiz was selected
    alert(`Starting quiz ${quizId} - This would show the quiz questions in a real app`);
    // In a complete app, you would show the questions here
}