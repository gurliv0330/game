const ASSETS = {
    // daylight character
    solSVG: `<svg width="44" height="44" viewBox="0 0 100 100">
        <!-- Sun Rays / Triangles -->
        <polygon points="50,10 58,35 42,35" fill="#fde047" stroke="#b45309" stroke-width="4" stroke-linejoin="round"/>
        <polygon points="78,22 62,40 54,28" fill="#fde047" stroke="#b45309" stroke-width="4" stroke-linejoin="round"/>
        <polygon points="90,50 65,58 65,42" fill="#fde047" stroke="#b45309" stroke-width="4" stroke-linejoin="round"/>
        <polygon points="78,78 62,60 72,52" fill="#fde047" stroke="#b45309" stroke-width="4" stroke-linejoin="round"/>
        <polygon points="50,90 58,65 42,65" fill="#fde047" stroke="#b45309" stroke-width="4" stroke-linejoin="round"/>
        <polygon points="22,78 38,60 28,52" fill="#fde047" stroke="#b45309" stroke-width="4" stroke-linejoin="round"/>
        <polygon points="10,50 35,58 35,42" fill="#fde047" stroke="#b45309" stroke-width="4" stroke-linejoin="round"/>
        <polygon points="22,22 38,40 46,28" fill="#fde047" stroke="#b45309" stroke-width="4" stroke-linejoin="round"/>

        <!-- Main Sun Circle Body -->
        <circle cx="50" cy="50" r="28" fill="#facc15" stroke="#b45309" stroke-width="4"/>

        <!-- Star Eyes -->
        <path d="M 38 42 L 39.5 45.5 L 43 46 L 40.5 48.5 L 41 52 L 38 50 L 35 52 L 35.5 48.5 L 33 46 L 36.5 45.5 Z" fill="#38bdf8" stroke="#b45309" stroke-width="1.5"/>
        <path d="M 62 42 L 63.5 45.5 L 67 46 L 64.5 48.5 L 65 52 L 62 50 L 59 52 L 59.5 48.5 L 57 46 L 60.5 45.5 Z" fill="#38bdf8" stroke="#b45309" stroke-width="1.5"/>

        <!-- Smile Path -->
        <path d="M 39 57 Q 50 66 61 57" fill="none" stroke="#b45309" stroke-width="3.5" stroke-linecap="round"/>
    </svg>`,

    // midnight character
    lunaSVG: `<svg width="44" height="44" viewBox="0 0 100 100">
        <!-- Main Blue Circle Body -->
        <circle cx="50" cy="50" r="32" fill="#b9d3dc" stroke="#000000" stroke-width="5"/>

        <!-- Star Eyes -->
        <path d="M 38 42 L 39.5 45.5 L 43 46 L 40.5 48.5 L 41 52 L 38 50 L 35 52 L 35.5 48.5 L 33 46 L 36.5 45.5 Z" fill="#ffff00" stroke="#000000" stroke-width="1.5"/>
        <path d="M 62 42 L 63.5 45.5 L 67 46 L 64.5 48.5 L 65 52 L 62 50 L 59 52 L 59.5 48.5 L 57 46 L 60.5 45.5 Z" fill="#ffff00" stroke="#000000" stroke-width="1.5"/>

        <!-- Cheeky Grinning Mouth -->
        <path d="M 38 58 Q 50 55 62 58 Q 58 72 46 68 Q 43 65 46 62" fill="#ffffff" stroke="#000000" stroke-width="2"/>
        <path d="M 46 62 Q 52 68 58 64" fill="none" stroke="#000000" stroke-width="1.5"/>
    </svg>`,

    // goal icons
    dayGoalIcon: '🌻',
    nightGoalIcon: '✨',
    switchIcon: '🔘',
    gateIcon: '🔒',

    // Level Designs (0 = empty, 1 = wall, 2 = goal portal, 3 = switch, 4 = gate)
    levels: [
        {
            dayStart: { x: 0, y: 2 },
            nightStart: { x: 4, y: 2 },
            dayMap: [
                [0, 0, 1, 0, 0],
                [0, 1, 0, 0, 0],
                [0, 0, 0, 1, 2],
                [0, 1, 0, 0, 0],
                [0, 0, 1, 0, 0],
            ],
            nightMap: [
                [0, 0, 0, 0, 0], 
                [0, 0, 1, 0, 0],
                [2, 1, 0, 0, 0],
                [0, 0, 1, 0, 0],
                [0, 0, 0, 0, 0],
            ]
        },
        {
            dayStart: { x: 0, y: 0 },
            nightStart: { x: 4, y: 4 },
            dayMap: [
                [0, 0, 1, 0, 0],
                [1, 0, 1, 0, 1],
                [0, 0, 0, 0, 0],
                [0, 1, 0, 0, 0],
                [0, 0, 0, 1, 2],
            ],
            nightMap: [
                [2, 1, 0, 0, 0],
                [0, 1, 0, 1, 0],
                [0, 0, 0, 0, 0],
                [1, 0, 1, 0, 1],
                [0, 0, 1, 0, 0]
            ]
        },
        {
            dayStart: { x: 0, y: 4 },
            nightStart: { x: 4, y: 0 },
            dayMap: [
                [0, 0, 0, 1, 2],
                [0, 1, 0, 1, 0],
                [0, 1, 0, 0, 0],
                [0, 1, 1, 1, 0],
                [0, 0, 0, 0, 0]
            ],
            nightMap: [
                [0, 0, 0, 0, 0],
                [0, 1, 1, 1, 0],
                [0, 0, 0, 1, 0],
                [0, 1, 0, 1, 0],
                [2, 0, 0, 0, 0]
            ]
        }
    ]
};

let currentLevel = 0;
let sol = { x: 0, y: 0 };
let luna = { x: 0, y: 0 };
let moveHistory = [];
let audioCtx = null; // [FIX]: Changed from capitalized `AudioCtx` to match `audioCtx` used in playChime()

function playChime(freq, type = 'sine') {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.25);
}

function loadLevel(index) {
    const lvl = ASSETS.levels[index];
    sol = { ...lvl.dayStart };
    luna = { ...lvl.nightStart };
    moveHistory = [];
    document.getElementById('level-display').textContent = `Level ${index + 1}`;
    document.getElementById('win-modal').classList.remove('active');
    renderBoards();
    //save level
    const savedLevel = parseInt(localStorage.getItem('solLunaLevel')) || 0;
    loadLevel(savedLevel);
}

function isSwitchActive() {
    const lvl = ASSETS.levels[currentLevel];
    return lvl.dayMap[sol.y][sol.x] === 3 || lvl.nightMap[luna.y][luna.x] === 3;
}

function canWalk(map, x, y) {
    if (x < 0 || x >= 5 || y < 0 || y >= 5) return false;
    const tile = map[y][x];
    if (tile === 1) return false; // wall blocks movement
    if (tile === 4 && !isSwitchActive()) return false; // closed gate blocks movement
    return true;
}

function drawGrid(elementId, map, player, playerSVG, goalIcon) {
    const board = document.getElementById(elementId);
    board.innerHTML = ''; // [FIX]: Fixed typo `board.innitHTML` -> `board.innerHTML`
    const gatesOpen = isSwitchActive();

    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            const tile = map[y][x]; // [FIX]: Fixed variable name typo `const title` -> `const tile`

            if (tile === 1) {
                cell.classList.add('wall');
            } else if (tile === 2) {
                cell.classList.add('goal');
                cell.textContent = goalIcon; // [FIX]: Fixed typo `goldIcon` in duplicate function -> `goalIcon`
            } else if (tile === 3) {
                cell.textContent = ASSETS.switchIcon;
            } else if (tile === 4) {
                cell.classList.add('gate');
                if (gatesOpen) cell.classList.add('open');
                cell.textContent = gatesOpen ? '' : ASSETS.gateIcon;
            }

            if (player.x === x && player.y === y) {
                cell.innerHTML = playerSVG; // [FIX]: Fixed typo `cell.innterHTML` -> `cell.innerHTML`
            }

            board.appendChild(cell);
        }
    }
}

function renderBoards() {
    const lvl = ASSETS.levels[currentLevel];
    drawGrid('day-grid', lvl.dayMap, sol, ASSETS.solSVG, ASSETS.dayGoalIcon);
    drawGrid('night-grid', lvl.nightMap, luna, ASSETS.lunaSVG, ASSETS.nightGoalIcon);
}

// [FIX]: Removed second, broken version of `movePlayers` at the bottom that didn't move Luna or check switches/gates
function movePlayers(dx, dy) {
    const lvl = ASSETS.levels[currentLevel];

    moveHistory.push({
        sol: { ...sol },
        luna: { ...luna }
    });

    let moved = false;

    if (canWalk(lvl.dayMap, sol.x + dx, sol.y + dy)) {
        sol.x += dx;
        sol.y += dy;
        moved = true;
    }

    if (canWalk(lvl.nightMap, luna.x + dx, luna.y + dy)) {
        luna.x += dx;
        luna.y += dy;
        moved = true;
    }

    if (!moved) {
        moveHistory.pop();
        return;
    }

    playChime(420, 'triangle');
    renderBoards();
    checkWin();
}

function undoMove() {
    if (moveHistory.length === 0) return;
    const previousState = moveHistory.pop();
    sol = previousState.sol;
    luna = previousState.luna;
    playChime(300, 'sine');
    renderBoards();
}

function checkWin() {
    const lvl = ASSETS.levels[currentLevel];
    const solOnGoal = lvl.dayMap[sol.y][sol.x] === 2;
    const lunaOnGoal = lvl.nightMap[luna.y][luna.x] === 2;

    if (solOnGoal && lunaOnGoal) {
        playChime(784, 'sine');
        setTimeout(() => {
            document.getElementById('win-modal').classList.add('active');
        }, 250);
    }
}

function nextLevel() {
    currentLevel = (currentLevel + 1) % ASSETS.levels.length;
    loadLevel(currentLevel);
}

window.addEventListener('keydown', (e) => {
    if (document.getElementById('win-modal').classList.contains('active')) return;

    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            movePlayers(0, -1);
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            movePlayers(0, 1); // [FIX]: Changed from `(0, -1)` to `(0, 1)` so Down actually moves down
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            movePlayers(-1, 0);
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            movePlayers(1, 0);
            break;
        case 'z':
        case 'Z':
            undoMove();
            break;
    }
});

loadLevel(0);
