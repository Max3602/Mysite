document.querySelector('.logo').addEventListener('click', function() {
    window.location.href = 'Авторизация.html';
});

document.querySelector('.reg-btn').addEventListener('click', function() {
    const name = document.querySelector('.name-input').value.trim();
    const email = document.querySelector('.email-input').value.trim();
    const login = document.querySelector('.login-input').value.trim();
    const password = document.querySelector('.password-input').value;
    const confirmPass = document.querySelector('.password-confirm').value;
    
    if (!name || !email || !login || !password || !confirmPass) {
        alert('Заполните все поля!');
        return;
    }
    
    if (password !== confirmPass) {
        alert('Пароли не совпадают!');
        return;
    }
    
    if (password.length < 6) {
        alert('Пароль должен быть не менее 6 символов');
        return;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
        alert('Введите корректный email');
        return;
    }
    
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some(u => u.login === login)) {
        alert('Пользователь с таким логином уже существует');
        return;
    }
    
    if (users.some(u => u.email === email)) {
        alert('Этот email уже зарегистрирован');
        return;
    }
    
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    const tempUser = {
        name: name,
        email: email,
        login: login,
        password: password,
        code: verificationCode,
        timestamp: Date.now(),
        registered: new Date().toLocaleString()
    };
    
    localStorage.setItem('tempUser', JSON.stringify(tempUser));
    
    console.log(`Код подтверждения для ${email}: ${verificationCode}`);
    alert(`[ТЕСТ] Код подтверждения отправлен на ${email}\n\nВаш код: ${verificationCode}\n\nВ реальном проекте это письмо пришло бы на почту.`);
    
    window.location.href = 'КодПодтверждения.html';
});

document.querySelector('.login-link').addEventListener('click', function() {
    if (localStorage.getItem('tempUser')) {
        if (confirm('У вас есть незавершенная регистрация. Продолжить?')) {
            window.location.href = 'КодПодтверждения.html';
            return;
        }
    }
    window.location.href = 'Авторизация.html';
});

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.querySelector('.reg-btn').click();
        }
    });
});

const buttons = document.querySelectorAll('.reg-btn, .login-link');
buttons.forEach(button => {
    button.addEventListener('mousedown', function() {
        this.style.transform = 'scale(0.95)';
    });
    
    button.addEventListener('mouseup', function() {
        this.style.transform = 'scale(1)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});