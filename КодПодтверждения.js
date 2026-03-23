document.addEventListener('DOMContentLoaded', function() {
    loadVerificationData();
    startTimer(60);
});

let timerInterval;
let timeLeft = 60;

function loadVerificationData() {
    const tempUser = JSON.parse(localStorage.getItem('tempUser'));
    
    if (!tempUser || !tempUser.email) {
        alert('Ошибка: данные не найдены. Пожалуйста, зарегистрируйтесь снова.');
        window.location.href = 'Регистрация.html';
        return;
    }
    
    document.getElementById('displayEmail').textContent = tempUser.email;
}

function startTimer(seconds) {
    timeLeft = seconds;
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            document.getElementById('resendBtn').disabled = false;
            document.getElementById('resendBtn').style.opacity = '1';
            document.getElementById('timer').textContent = 'Время истекло. Отправьте код повторно.';
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerElement = document.getElementById('timer');
    if (timeLeft > 0) {
        timerElement.textContent = `Код действителен: ${timeLeft} сек.`;
        document.getElementById('resendBtn').disabled = true;
        document.getElementById('resendBtn').style.opacity = '0.5';
    }
}

function sendVerificationCode(email) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    const tempUser = JSON.parse(localStorage.getItem('tempUser'));
    if (tempUser) {
        tempUser.code = code;
        tempUser.timestamp = Date.now();
        localStorage.setItem('tempUser', JSON.stringify(tempUser));
    }
    
    console.log(`Код подтверждения для ${email}: ${code}`); 
    alert(`[ТЕСТ] Ваш код подтверждения: ${code}\n\nВ реальном проекте он пришел бы на email ${email}`);
    
    return code;
}

document.getElementById('verifyBtn').addEventListener('click', function() {
    const enteredCode = document.getElementById('codeInput').value.trim();
    const tempUser = JSON.parse(localStorage.getItem('tempUser'));
    
    if (!tempUser) {
        alert('Ошибка: данные не найдены');
        window.location.href = 'Регистрация.html';
        return;
    }
    
    if (enteredCode === tempUser.code) {
        const timeDiff = Date.now() - tempUser.timestamp;
        if (timeDiff > 10 * 60 * 1000) {
            alert('Код устарел. Запросите новый');
            return;
        }
        
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        
        const newUser = {
            id: Date.now().toString(),
            name: tempUser.name,
            email: tempUser.email,
            login: tempUser.login,
            password: tempUser.password,
            verified: true,
            verifiedDate: new Date().toLocaleString(),
            registered: tempUser.registered || new Date().toLocaleString(),
            gameHistory: []
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        localStorage.setItem('currentUser', JSON.stringify({
            id: newUser.id,
            name: newUser.name,
            login: newUser.login,
            email: newUser.email,
            verified: true
        }));
        
        localStorage.removeItem('tempUser');
        
        clearInterval(timerInterval);
        
        alert(`Email ${newUser.email} успешно подтвержден! Добро пожаловать, ${newUser.name}!`);
        window.location.href = 'Колесо Фортуны.html';
    } else {
        alert('Неверный код подтверждения');
        document.getElementById('codeInput').value = '';
        document.getElementById('codeInput').focus();
    }
});

document.getElementById('resendBtn').addEventListener('click', function() {
    const tempUser = JSON.parse(localStorage.getItem('tempUser'));
    
    if (!tempUser) {
        alert('Ошибка: данные не найдены');
        window.location.href = 'Регистрация.html';
        return;
    }
    
    sendVerificationCode(tempUser.email);
    
    clearInterval(timerInterval);
    startTimer(60);
});

document.querySelector('.logo').addEventListener('click', function() {
    if (confirm('Вернуться на главную? Данные регистрации будут потеряны.')) {
        localStorage.removeItem('tempUser');
        window.location.href = 'Авторизация.html';
    }
});

document.getElementById('codeInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('verifyBtn').click();
    }
});

document.getElementById('codeInput').addEventListener('input', function(e) {
    this.value = this.value.replace(/[^0-9]/g, ''); 
    if (this.value.length === 6) {
        document.getElementById('verifyBtn').focus();
    }
});