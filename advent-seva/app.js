document.addEventListener('DOMContentLoaded', () => {
    const taskView = document.getElementById('task-view');
    const successView = document.getElementById('success-view');

    const taskTitle = document.getElementById('task-title');
    const taskText = document.getElementById('task-text');
    const taskImage = document.getElementById('task-image');
    const errorMessage = document.getElementById('error-message');
    const hintMessage = document.getElementById('hint-message');
    const answerInput = document.getElementById('answer-input');
    const submitButton = document.getElementById('submit-button');

    const successMessage = document.getElementById('success-message');

    // Get day from URL query param
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('clearall')) {
        for (let i = 1; i <= tasks.length; i++) {
            localStorage.removeItem(`advent-seva-day-${i}`);
        }
        document.body.innerHTML = '<div class="container" style="text-align: center;"><h1>Все состояния стерты.</h1><p><a href="?day=1">Начать заново</a></p></div>';
        return;
    }

    const dayId = parseInt(urlParams.get('day'), 10);

    if (!dayId || isNaN(dayId) || dayId < 1 || dayId > tasks.length) {
        taskTitle.textContent = "Задача не найдена. Пожалуйста, используйте правильный QR-код.";
        taskText.classList.add('hidden');
        answerInput.classList.add('hidden');
        submitButton.classList.add('hidden');
        return;
    }

    const currentTask = tasks.find(t => t.id === dayId);
    const storageKey = `advent-seva-day-${dayId}`;

    let state = localStorage.getItem(storageKey) || 'initial';

    const render = () => {
        if (state === 'correct') {
            taskView.classList.add('hidden');
            successView.classList.remove('hidden');
            successMessage.innerHTML = `Молодец, Севик! Ответ правильный! Ты найдешь свой подарок <b>${currentTask.giftLocation}</b>.`;
        } else {
            taskView.classList.remove('hidden');
            successView.classList.add('hidden');
            
            taskTitle.textContent = `Привет, Сева! ${currentTask.date}, задача ${currentTask.topic}.`;
            taskText.innerHTML = currentTask.taskText;

            if (currentTask.image) {
                taskImage.src = currentTask.image;
                taskImage.classList.remove('hidden');
            } else {
                taskImage.classList.add('hidden');
            }

            if (state === 'incorrect') {
                errorMessage.textContent = 'ОТВЕТ НЕПРАВИЛЬНЫЙ';
                errorMessage.classList.remove('hidden');
                
                if (currentTask.hint !== 'нет подсказки') {
                    hintMessage.textContent = currentTask.hint;
                    hintMessage.classList.remove('hidden');
                } else {
                    hintMessage.classList.add('hidden');
                }

            } else { // initial state
                errorMessage.classList.add('hidden');
                hintMessage.classList.add('hidden');
            }
        }
    };

    const checkAnswer = () => {
        const userAnswer = answerInput.value.trim();
        if (userAnswer === '') {
            return; // Do nothing on empty input
        }

        if ([2, 3, 4].includes(currentTask.id)) {
            state = 'correct';
            localStorage.setItem(storageKey, state);
            render();
            return;
        }

        const correctAnswer = String(currentTask.correctAnswer).trim();
        
        // Simple, case-insensitive, space-insensitive comparison
        const isCorrect = userAnswer.replace(/\s+/g, '').toLowerCase() === correctAnswer.replace(/\s+/g, '').toLowerCase();

        if (isCorrect) {
            state = 'correct';
        } else {
            state = 'incorrect';
        }
        
        localStorage.setItem(storageKey, state);
        render();
    };

    submitButton.addEventListener('click', checkAnswer);
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });

    // Initial render
    render();
});
