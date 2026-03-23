const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');

let sections = 8;
let elements = ['1', '2', '3', '4', '5', '6', '7', '8']; 
const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFE194', '#B19CD9', '#FF9999', '#77DD77'
];

let currentAngle = 0;
let isSpinning = false;
let spinVelocity = 0;
const spinDeceleration = 0.97;
const minVelocity = 0.01;

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 180;
    const anglePerSection = (Math.PI * 2) / sections;
    
    for (let i = 0; i < sections; i++) {
        const startAngle = i * anglePerSection + currentAngle;
        const endAngle = startAngle + anglePerSection;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + anglePerSection / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Arial';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 5;
        
        let text = elements[i].toString();
        if (text.length > 5) {
            text = text.substring(0, 4) + '...';
        }
        
        ctx.fillText(text, radius * 0.7, 0);
        ctx.restore();
    }
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
    ctx.fillStyle = '#333';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#8B4513';
    ctx.fill();
}

document.querySelector('.LK').addEventListener('click', function() {
    this.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        window.location.href = 'Лк.html'; 
    }, 150);
});

function spin() {
    if (isSpinning) return;
    if (sections === 0) {
        alert('Добавьте элементы в колесо!');
        return;
    }
    
    isSpinning = true;
    spinBtn.disabled = true;
    spinBtn.style.opacity = '0.5';
    spinVelocity = 20 + Math.random() * 10;
    
    function animate() {
        currentAngle += spinVelocity * 0.02;
        spinVelocity *= spinDeceleration;
        drawWheel();
        
        if (spinVelocity > minVelocity) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            spinBtn.disabled = false;
            spinBtn.style.opacity = '1';
            showResult();
        }
    }
    
    requestAnimationFrame(animate);
}

function showResult() {
    const anglePerSection = (Math.PI * 2) / sections;
    
    let normalizedAngle = currentAngle % (Math.PI * 2);
    if (normalizedAngle < 0) normalizedAngle += Math.PI * 2;
    
    const pointerAngle = (3 * Math.PI) / 2;
    
    let angleFromPointer = (pointerAngle - normalizedAngle + 2 * Math.PI) % (2 * Math.PI);
    
    let selectedIndex = Math.floor(angleFromPointer / anglePerSection);
    
    if (selectedIndex >= sections) selectedIndex = 0;
    if (selectedIndex < 0) selectedIndex = sections - 1;
    
    const result = elements[selectedIndex];
    alert(`🎉 ВЫПАЛО: ${result} 🎉`);
}

const elementsList = document.getElementById('elementsList');
const newElementInput = document.getElementById('newElement');
const addBtn = document.getElementById('addBtn');
const scrollThumb = document.querySelector('.scroll-thumb');

function renderElements() {
    elementsList.innerHTML = '';
    elements.forEach((element, index) => {
        const elementDiv = document.createElement('div');
        elementDiv.className = 'element-item';
        
        const textSpan = document.createElement('span');
        textSpan.textContent = element;
        textSpan.style.flex = '1';
        
        const deleteBtn = document.createElement('span');
        deleteBtn.textContent = '✖';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.fontWeight = 'bold';
        deleteBtn.style.fontSize = '16px';
        deleteBtn.style.width = '20px';
        deleteBtn.style.height = '20px';
        deleteBtn.style.display = 'flex';
        deleteBtn.style.alignItems = 'center';
        deleteBtn.style.justifyContent = 'center';
        deleteBtn.style.borderRadius = '50%';
        deleteBtn.style.backgroundColor = 'rgba(0,0,0,0.3)';
        deleteBtn.style.transition = 'all 0.2s ease';
        
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            removeElement(index);
        };
        
        deleteBtn.onmouseover = () => {
            deleteBtn.style.color = 'white';
            deleteBtn.style.transform = 'scale(1.1)';
        };
        
        deleteBtn.onmouseout = () => {
            deleteBtn.style.backgroundColor = 'rgba(0,0,0,0.3)';
            deleteBtn.style.transform = 'scale(1)';
        };
        
        elementDiv.appendChild(textSpan);
        elementDiv.appendChild(deleteBtn);
        elementsList.appendChild(elementDiv);
    });
    
    updateScrollbar();
    sections = elements.length;
    drawWheel();
}

function removeElement(index) {
    if (elements.length <= 1) {
        alert('Должен быть хотя бы один элемент!');
        return;
    }
    elements.splice(index, 1);
    renderElements();
}

function addElement() {
    const newElement = newElementInput.value.trim();
    if (newElement) {
        elements.push(newElement);
        renderElements();
        newElementInput.value = '';
        
        setTimeout(() => {
            elementsList.scrollTop = elementsList.scrollHeight;
        }, 100);
    } else {
        alert('Введите элемент!');
    }
}

function updateScrollbar() {
    const scrollHeight = elementsList.scrollHeight;
    const clientHeight = elementsList.clientHeight;
    const scrollRatio = clientHeight / scrollHeight;
    
    if (scrollRatio < 1) {
        scrollThumb.style.height = `${Math.max(30, scrollRatio * 100)}px`;
    } else {
        scrollThumb.style.height = '100%';
        scrollThumb.style.top = '0';
    }
}

spinBtn.addEventListener('click', spin);
addBtn.addEventListener('click', addElement);

newElementInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addElement();
    }
});

let isDragging = false;
let startY = 0;
let startScrollTop = 0;

scrollThumb.addEventListener('mousedown', (e) => {
    isDragging = true;
    startY = e.clientY;
    startScrollTop = elementsList.scrollTop;
    document.body.style.userSelect = 'none';
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const deltaY = e.clientY - startY;
    const maxScroll = elementsList.scrollHeight - elementsList.clientHeight;
    const deltaScroll = (deltaY / elementsList.clientHeight) * maxScroll;
    elementsList.scrollTop = Math.max(0, Math.min(maxScroll, startScrollTop + deltaScroll));
    
    const thumbPosition = (elementsList.scrollTop / maxScroll) * (100 - parseFloat(scrollThumb.style.height));
    scrollThumb.style.top = `${thumbPosition}%`;
});

document.querySelector('.LK').addEventListener('click', function() {
    window.location.href = 'Лк.html';
});

document.querySelector('.logo').addEventListener('click', function() {
    window.location.href = 'index.html';
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.style.userSelect = '';
});

elementsList.addEventListener('scroll', () => {
    const maxScroll = elementsList.scrollHeight - elementsList.clientHeight;
    if (maxScroll > 0) {
        const thumbHeight = parseFloat(scrollThumb.style.height);
        const thumbPosition = (elementsList.scrollTop / maxScroll) * (100 - thumbHeight);
        scrollThumb.style.top = `${thumbPosition}%`;
    }
});

function showResult() {
    const anglePerSection = (Math.PI * 2) / sections;
    
    let normalizedAngle = currentAngle % (Math.PI * 2);
    if (normalizedAngle < 0) normalizedAngle += Math.PI * 2;
    
    const pointerAngle = (3 * Math.PI) / 2;
    
    let angleFromPointer = (pointerAngle - normalizedAngle + 2 * Math.PI) % (2 * Math.PI);
    
    let selectedIndex = Math.floor(angleFromPointer / anglePerSection);
    
    if (selectedIndex >= sections) selectedIndex = 0;
    if (selectedIndex < 0) selectedIndex = sections - 1;
    
    const result = elements[selectedIndex];
    
    localStorage.setItem('lastGameResult', result);
    
    saveResultToUserHistory(result);
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userName = currentUser ? currentUser.name || currentUser.login : 'Гость';
    
    alert(`🎉 ${userName}, ВАМ ВЫПАЛО: ${result} 🎉`);
}

function saveResultToUserHistory(result) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        saveGuestResult(result);
        return;
    }
    
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
        if (!users[userIndex].gameHistory) {
            users[userIndex].gameHistory = [];
        }
        
        users[userIndex].gameHistory.unshift({
            result: result,
            date: new Date().toLocaleString(),
            elements: [...elements]
        });
        
        if (users[userIndex].gameHistory.length > 20) {
            users[userIndex].gameHistory = users[userIndex].gameHistory.slice(0, 20);
        }
        
        localStorage.setItem('users', JSON.stringify(users));
    }
}

function saveGuestResult(result) {
    let guestHistory = JSON.parse(localStorage.getItem('guestHistory') || '[]');
    guestHistory.unshift({
        result: result,
        date: new Date().toLocaleString()
    });
    if (guestHistory.length > 10) {
        guestHistory = guestHistory.slice(0, 10);
    }
    localStorage.setItem('guestHistory', JSON.stringify(guestHistory));
}

document.querySelector('.logo').addEventListener('click', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        window.location.href = 'Колесо Фортуны.html';
    } else {
        window.location.href = 'Авторизация.html';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    const nikElement = document.querySelector('.nik');
    if (nikElement) {
        if (currentUser) {
            nikElement.textContent = currentUser.name || currentUser.login;
        } else {
            nikElement.textContent = 'Гость';
        }
    }
    
    renderElements();
    drawWheel();
});