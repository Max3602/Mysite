document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
});

function loadUserData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        loadGuestData();
        return;
    }
    
    const nikElement = document.querySelector('.nik');
    if (nikElement) {
        nikElement.textContent = currentUser.name || currentUser.login;
    }
    
    const lastResult = localStorage.getItem('lastGameResult');
    const resultElement = document.querySelector('.result');
    if (lastResult && resultElement) {
        resultElement.textContent = lastResult;
    }
    
    loadUserGameHistory(currentUser.id);
}

function loadGuestData() {
    const nikElement = document.querySelector('.nik');
    if (nikElement) {
        nikElement.textContent = 'Гость';
    }
    
    const lastResult = localStorage.getItem('lastGameResult');
    const resultElement = document.querySelector('.result');
    if (lastResult && resultElement) {
        resultElement.textContent = lastResult;
    }
    
    loadGuestHistory();
}

function loadUserGameHistory(userId) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === userId);
    
    const prevGamesContainer = document.querySelector('.prev-games');
    if (!prevGamesContainer) return;
    
    prevGamesContainer.innerHTML = '';
    
    if (user && user.gameHistory && user.gameHistory.length > 0) {
        user.gameHistory.forEach((game, index) => {
            const gameItem = createGameHistoryItem(index, game);
            prevGamesContainer.appendChild(gameItem);
        });
    } else {
        prevGamesContainer.innerHTML = `
            <div class="prev-game-item">
                <span class="game-number">-</span>
                <span class="game-result">У вас пока нет игр</span>
            </div>
        `;
    }
}

function loadGuestHistory() {
    const guestHistory = JSON.parse(localStorage.getItem('guestHistory') || '[]');
    const prevGamesContainer = document.querySelector('.prev-games');
    if (!prevGamesContainer) return;
    
    prevGamesContainer.innerHTML = '';
    
    if (guestHistory.length > 0) {
        guestHistory.forEach((game, index) => {
            const gameItem = createGameHistoryItem(index, game);
            prevGamesContainer.appendChild(gameItem);
        });
    } else {
        prevGamesContainer.innerHTML = `
            <div class="prev-game-item">
                <span class="game-number">-</span>
                <span class="game-result">Войдите, чтобы сохранять историю</span>
            </div>
        `;
    }
}

function createGameHistoryItem(index, game) {
    const gameItem = document.createElement('div');
    gameItem.className = 'prev-game-item';
    
    const numberSpan = document.createElement('span');
    numberSpan.className = 'game-number';
    numberSpan.textContent = `#${index + 1}`;
    
    const resultSpan = document.createElement('span');
    resultSpan.className = 'game-result';
    resultSpan.textContent = game.result;
    
    gameItem.title = game.date || '';
    
    gameItem.appendChild(numberSpan);
    gameItem.appendChild(resultSpan);
    
    return gameItem;
}

document.querySelector('.save')?.addEventListener('click', function() {
    const currentResult = document.querySelector('.result')?.textContent;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        alert('Войдите в аккаунт, чтобы сохранять результаты');
        return;
    }
    
    if (!currentResult || 
        currentResult === 'Результат последней игры' || 
        currentResult === 'Результат удален') {
        alert('Нет результата для сохранения');
        return;
    }
    
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) {
        alert('Ошибка: пользователь не найден');
        return;
    }
    
    if (!users[userIndex].gameHistory) {
        users[userIndex].gameHistory = [];
    }
    
    const lastSaved = users[userIndex].gameHistory[0];
    if (lastSaved && lastSaved.result === currentResult && lastSaved.date) {
        const timeDiff = Date.now() - new Date(lastSaved.date).getTime();
        if (timeDiff < 60000) {
            alert('Этот результат уже был недавно сохранен');
            return;
        }
    }
    
    users[userIndex].gameHistory.unshift({
        result: currentResult,
        date: new Date().toLocaleString()
    });
    
    if (users[userIndex].gameHistory.length > 20) {
        users[userIndex].gameHistory = users[userIndex].gameHistory.slice(0, 20);
    }
    
    localStorage.setItem('users', JSON.stringify(users));
    loadUserGameHistory(currentUser.id);
    alert(`Результат сохранен в истории, ${currentUser.name || currentUser.login}!`);
});

document.querySelector('.del')?.addEventListener('click', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const resultElement = document.querySelector('.result');
    
    if (confirm('Удалить результат последней игры?')) {
        if (resultElement) {
            resultElement.textContent = 'Результат удален';
        }
        localStorage.removeItem('lastGameResult');
        
        if (currentUser) {
            alert(`Результат удален, ${currentUser.name || currentUser.login}`);
        }
    }
});

document.querySelector('.exit')?.addEventListener('click', function() {
    window.location.href = 'Колесо Фортуны.html';
});

document.querySelector('.logo')?.addEventListener('click', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        window.location.href = 'Колесо Фортуны.html';
    } else {
        window.location.href = 'Авторизация.html';
    }
});

const logoutBtn = document.querySelector('.logout');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const userName = currentUser?.name || currentUser?.login || 'Гость';
        
        if (confirm(`Выйти из аккаунта, ${userName}?`)) {
            localStorage.removeItem('currentUser');
            window.location.href = 'Авторизация.html';
        }
    });
}

document.querySelectorAll('.save, .del, .exit, .logout').forEach(button => {
    if (button) {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
            this.style.transition = 'transform 0.1s ease';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
});