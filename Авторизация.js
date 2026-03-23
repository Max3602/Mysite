const ADMIN_CONFIG = {
    login: 'admin',
    password: 'admin123'
};


window.showAdminLogin = function() {
    document.getElementById('adminModal').style.display = 'block';
}

window.closeAdminModal = function() {
    document.getElementById('adminModal').style.display = 'none';
    const loginInput = document.getElementById('adminLogin');
    const passInput = document.getElementById('adminPassword');
    if (loginInput) loginInput.value = '';
    if (passInput) passInput.value = '';
}

window.loginAdmin = function() {
    const login = document.getElementById('adminLogin')?.value.trim() || '';
    const password = document.getElementById('adminPassword')?.value || '';
    
    if (login === ADMIN_CONFIG.login && password === ADMIN_CONFIG.password) {
        closeAdminModal();
        loadAdminPanel();
        document.getElementById('adminPanel').style.display = 'block';
    } else {
        alert('❌ Неверный логин или пароль администратора!');
    }
}

window.closeAdminPanel = function() {
    document.getElementById('adminPanel').style.display = 'none';
}

window.loadAdminPanel = function() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const totalUsersEl = document.getElementById('totalUsers');
    const verifiedUsersEl = document.getElementById('verifiedUsers');
    const totalGamesEl = document.getElementById('totalGames');
    
    if (totalUsersEl) totalUsersEl.textContent = users.length;
    if (verifiedUsersEl) verifiedUsersEl.textContent = users.filter(u => u.verified).length;
    
    const totalGames = users.reduce((sum, user) => sum + (user.gameHistory?.length || 0), 0);
    if (totalGamesEl) totalGamesEl.textContent = totalGames;
    
    displayUsers(users);
}

window.displayUsers = function(users) {
    const usersList = document.getElementById('usersList');
    if (!usersList) return;
    
    if (users.length === 0) {
        usersList.innerHTML = '<div style="color: white; text-align: center; padding: 20px;">📭 Нет зарегистрированных пользователей</div>';
        return;
    }
    
    let html = '';
    users.forEach((user) => {
        const firstLetter = user.name ? user.name[0].toUpperCase() : user.login[0].toUpperCase();
        const gameCount = user.gameHistory?.length || 0;
        const verifiedStatus = user.verified ? '✅' : '⏳';
        const dateStr = user.registered || 'неизвестно';
        
        html += `
            <div class="user-item" id="user-${user.id}">
                <div class="user-avatar">${firstLetter}</div>
                <div class="user-info">
                    <div class="user-name">${user.name} ${verifiedStatus}</div>
                    <div class="user-details">
                        Логин: ${user.login} | Email: ${user.email}<br>
                        ID: ${user.id.slice(-8)} | Игр: ${gameCount} | Дата: ${dateStr}
                    </div>
                </div>
                <div class="user-actions">
                    <button class="edit-btn" onclick="editUser('${user.id}')" title="Редактировать">✏️</button>
                    <button class="delete-btn" onclick="deleteUser('${user.id}')" title="Удалить">🗑️</button>
                </div>
            </div>
        `;
    });
    
    usersList.innerHTML = html;
}

window.searchUsers = function(query) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const filtered = users.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.login.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
    );
    displayUsers(filtered);
}

window.deleteUser = function(userId) {
    if (confirm('🗑️ Вы уверены, что хотите удалить этого пользователя?')) {
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        users = users.filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(users));
        loadAdminPanel();
        
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (currentUser.id === userId) {
            localStorage.removeItem('currentUser');
        }
    }
}

window.editUser = function(userId) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === userId);
    
    if (!user) return;
    
    const newName = prompt('✏️ Введите новое имя пользователя:', user.name);
    if (newName && newName.trim()) {
        user.name = newName.trim();
        localStorage.setItem('users', JSON.stringify(users));
        loadAdminPanel();
    }
}

window.deleteAllAccounts = function() {
    if (confirm('🚨 ВНИМАНИЕ! Вы точно хотите УДАЛИТЬ ВСЕХ пользователей? Это действие нельзя отменить!')) {
        localStorage.setItem('users', '[]');
        localStorage.removeItem('guestHistory');
        localStorage.removeItem('currentUser');
        alert('✅ Все пользователи удалены!');
        loadAdminPanel();
    }
}

window.clearGuestHistory = function() {
    if (confirm('🧹 Удалить историю игр всех гостей?')) {
        localStorage.removeItem('guestHistory');
        alert('✅ История гостей очищена!');
    }
}

window.exportUsers = function() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const dataStr = JSON.stringify(users, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const date = new Date().toISOString().slice(0,19).replace(/:/g, '-');
    const exportFileDefaultName = `users_backup_${date}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    alert(`📥 Экспортировано ${users.length} пользователей`);
}

window.importUsers = function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const users = JSON.parse(e.target.result);
                if (Array.isArray(users)) {
                    localStorage.setItem('users', JSON.stringify(users));
                    loadAdminPanel();
                    alert(`✅ Импортировано ${users.length} пользователей!`);
                } else {
                    alert('❌ Ошибка: неверный формат файла');
                }
            } catch (error) {
                alert('❌ Ошибка при чтении файла');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

document.addEventListener('DOMContentLoaded', function() {
    
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function() {
            window.location.href = 'Авторизация.html';
        });
    }
    
    const avtBtn = document.querySelector('.avt');
    if (avtBtn) {
        avtBtn.addEventListener('click', function() {
            const login = document.querySelector('.login-input')?.value.trim() || '';
            const password = document.querySelector('.password-input')?.value || '';
            
            if (!login || !password) {
                alert('Введите логин и пароль');
                return;
            }
            
            let users = JSON.parse(localStorage.getItem('users') || '[]');
            
            const user = users.find(u => (u.login === login || u.email === login) && u.password === password);
            
            if (user) {
                if (!user.verified) {
                    alert('Email не подтвержден. Пожалуйста, подтвердите email для входа.');
                    
                    const tempUser = {
                        name: user.name,
                        email: user.email,
                        login: user.login,
                        password: user.password,
                        registered: user.registered
                    };
                    localStorage.setItem('tempUser', JSON.stringify(tempUser));
                    
                    if (confirm('Отправить код подтверждения повторно?')) {
                        window.location.href = 'КодПодтверждения.html';
                    }
                    return;
                }
                
                localStorage.setItem('currentUser', JSON.stringify({
                    id: user.id,
                    name: user.name,
                    login: user.login,
                    email: user.email,
                    verified: true
                }));
                
                alert(`Добро пожаловать, ${user.name}!`);
                window.location.href = 'Колесо Фортуны.html';
            } else {
                alert('Неверный логин/email или пароль');
            }
        });
    }
    
    const regBtn = document.querySelector('.reg');
    if (regBtn) {
        regBtn.addEventListener('click', function() {
            window.location.href = 'Регистрация.html';
        });
    }
    
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const avtBtn = document.querySelector('.avt');
                if (avtBtn) avtBtn.click();
            }
        });
    });
    
    const buttons = document.querySelectorAll('.avt, .reg');
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
    
    window.onclick = function(event) {
        const modal = document.getElementById('adminModal');
        if (event.target === modal) {
            closeAdminModal();
        }
    };
    
});