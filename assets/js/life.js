
const canvas = document.getElementById('life-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let cells = [];
let cellSize = 10; // Size of each cell
let cols, rows;
let animationId;

// Cyber Colors (Brightened)
const colors = [
    'rgba(34, 211, 238, 0.8)', // Cyan (high opacity)
    'rgba(168, 85, 247, 0.8)', // Purple (high opacity)
    'rgba(34, 211, 238, 0.4)', // Faint Cyan
];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    cols = Math.floor(width / cellSize);
    rows = Math.floor(height / cellSize);
    initCells();
}

function initCells() {
    cells = new Array(cols).fill(null).map(() => new Array(rows).fill(0));
    // Random initial seed (sparse)
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (Math.random() < 0.1) {
                cells[i][j] = 1;
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (cells[i][j] === 1) {
                ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
                ctx.shadowBlur = 5;
                ctx.shadowColor = ctx.fillStyle;
                ctx.fillRect(i * cellSize, j * cellSize, cellSize - 1, cellSize - 1);
                ctx.shadowBlur = 0;
            }
        }
    }
}

function update() {
    let nextGen = cells.map(arr => [...arr]);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let state = cells[i][j];
            let neighbors = countNeighbors(cells, i, j);

            if (state == 0 && neighbors == 3) {
                nextGen[i][j] = 1;
            } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
                nextGen[i][j] = 0;
            } else {
                nextGen[i][j] = state;
            }
        }
    }

    cells = nextGen;
}

function countNeighbors(grid, x, y) {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            let col = (x + i + cols) % cols;
            let row = (y + j + rows) % rows;
            sum += grid[col][row];
        }
    }
    sum -= grid[x][y];
    return sum;
}

function animate() {
    draw();
    // Slow down animation slightly
    setTimeout(() => {
        update();
        animationId = requestAnimationFrame(animate);
    }, 100);
}

// Mouse Interaction
window.addEventListener('mousemove', (e) => {
    const x = Math.floor(e.clientX / cellSize);
    const y = Math.floor(e.clientY / cellSize);

    // Spawn cluster of life around mouse
    for (let i = -2; i < 3; i++) {
        for (let j = -2; j < 3; j++) {
            let col = (x + i + cols) % cols;
            let row = (y + j + rows) % rows;
            if (Math.random() > 0.5) cells[col][row] = 1;
        }
    }
});

window.addEventListener('resize', resize);
resize();
animate();
