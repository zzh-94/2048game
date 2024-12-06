let grid = [];
let score = 0;
const MAX_RANKINGS = 5;

function initGame() {
    grid = Array(16).fill(0);
    score = 0;
    document.getElementById('score').textContent = score;
    addNewNumber();
    addNewNumber();
    updateDisplay();
    displayRankings();
}

function addNewNumber() {
    const emptyCells = grid.reduce((acc, curr, idx) => {
        if (curr === 0) acc.push(idx);
        return acc;
    }, []);
    
    if (emptyCells.length > 0) {
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[randomCell] = Math.random() < 0.9 ? 2 : 4;
    }
}

function updateDisplay() {
    const cells = document.querySelectorAll('.cell');
    grid.forEach((value, index) => {
        cells[index].textContent = value || '';
        cells[index].setAttribute('data-value', value);
    });
}

function isGameOver() {
    if (grid.includes(0)) return false;
    
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[i * 4 + j] === grid[i * 4 + j + 1]) return false;
        }
    }
    
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i * 4 + j] === grid[(i + 1) * 4 + j]) return false;
        }
    }
    
    if (isOver) {
        updateRankings(score);
        alert('游戏结束！最终得分：' + score);
    }
    
    return isOver;
}

function move(direction) {
    let moved = false;
    const oldGrid = [...grid];
    
    if (direction === 'left' || direction === 'right') {
        for (let i = 0; i < 4; i++) {
            let row = grid.slice(i * 4, (i + 1) * 4);
            row = direction === 'left' ? moveRow(row) : moveRow(row.reverse()).reverse();
            for (let j = 0; j < 4; j++) {
                grid[i * 4 + j] = row[j];
            }
        }
    } else {
        for (let i = 0; i < 4; i++) {
            let column = [grid[i], grid[i + 4], grid[i + 8], grid[i + 12]];
            column = direction === 'up' ? moveRow(column) : moveRow(column.reverse()).reverse();
            for (let j = 0; j < 4; j++) {
                grid[i + j * 4] = column[j];
            }
        }
    }

    moved = !grid.every((value, index) => value === oldGrid[index]);
    
    if (moved) {
        addNewNumber();
        updateDisplay();
        document.getElementById('score').textContent = score;
        
        if (isGameOver()) {
            alert('游戏结束！最终得分：' + score);
        }
    }
}

function moveRow(row) {
    row = row.filter(cell => cell !== 0);
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] *= 2;
            score += row[i];
            row.splice(i + 1, 1);
        }
    }
    while (row.length < 4) {
        row.push(0);
    }
    return row;
}

function resetGame() {
    initGame();
}

let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});

document.addEventListener('touchend', (event) => {
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > 30) {
            if (deltaX > 0) {
                move('right');
            } else {
                move('left');
            }
        }
    } else {
        if (Math.abs(deltaY) > 30) {
            if (deltaY > 0) {
                move('down');
            } else {
                move('up');
            }
        }
    }
});

function updateRankings(newScore) {
    let rankings = JSON.parse(localStorage.getItem('rankings') || '[]');
    
    rankings.push({
        score: newScore,
        date: new Date().toLocaleDateString()
    });
    
    rankings.sort((a, b) => b.score - a.score);
    rankings = rankings.slice(0, MAX_RANKINGS);
    
    localStorage.setItem('rankings', JSON.stringify(rankings));
    
    displayRankings();
}

function displayRankings() {
    const rankings = JSON.parse(localStorage.getItem('rankings') || '[]');
    const rankingsList = document.getElementById('rankings');
    
    rankingsList.innerHTML = rankings.map(item => 
        `<li>${item.score}分 (${item.date})</li>`
    ).join('');
}

// 添加键盘事件监听
document.addEventListener('keydown', (event) => {
    event.preventDefault(); // 防止按键滚动页面
    
    switch (event.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
            move('left');
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            move('right');
            break;
        case 'ArrowUp':
        case 'w':
        case 'W':
            move('up');
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            move('down');
            break;
    }
});

initGame(); 
