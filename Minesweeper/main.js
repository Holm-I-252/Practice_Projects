let start_btn = document.getElementById("start_button");
let grid_element = document.getElementById("grid");
let rows_input = document.getElementById("rows");
let cols_input = document.getElementById("cols");
let mines_input = document.getElementById("mines");
let score_element = document.getElementById("score");

let score = 0;
let running = true;
let minePositions = []; // Changed to array for easier handling in your existing logic

start_btn.addEventListener("click", () => {
    score = 0;
    score_element.innerText = score;
    grid_element.classList.remove("prep");
    document.body.classList.remove("explode");

    const rows = parseInt(rows_input.value);
    const cols = parseInt(cols_input.value);
    const mines = parseInt(mines_input.value);
    
    // Basic validation
    if (mines >= rows * cols) {
        alert("Number of mines must be less than total cells!");
        return;
    }

    // Reset game state
    running = true;
    document.getElementById("win_or_lose").innerText = ""; 
    
    console.log(`Starting game with ${rows} rows, ${cols} columns, and ${mines} mines.`);
    createGrid(rows, cols);
    placeMines(rows, cols, mines);
    const boardData = calculateNeighborCounts(rows, cols, minePositions);
    
    // Loop through the grid DOM elements and attach the number
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cellIndex = r * cols + c;
            const cell = grid_element.children[cellIndex];
            
            // We use a data-attribute to store the number on the HTML tag itself
            const value = boardData[r][c];
            cell.setAttribute("data-value", value);
        }
    }
});

function calculateNeighborCounts(rows, cols, minePositions) {
    // 1. Create a 2D array filled with zeros
    let board = Array.from({ length: rows }, () => Array(cols).fill(0));

    // 2. Mark mines on the board (using -1 to represent a mine)
    minePositions.forEach(([r, c]) => {
        board[r][c] = -1;
    });

    // 3. Define the 8 directions (offsets) a neighbor can be
    const directions = [
        [-1, -1], [-1, 0], [-1, 1], // Top row
        [0, -1],           [0, 1],  // Left and Right
        [1, -1],  [1, 0],  [1, 1]   // Bottom row
    ];

    // 4. Loop through every cell to calculate numbers
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            // If this cell is a mine, we don't need a number
            if (board[r][c] === -1) continue;

            let mineCount = 0;

            // Check all 8 neighbors
            directions.forEach(([dr, dc]) => {
                const nr = r + dr; // neighbor row
                const nc = c + dc; // neighbor col

                // Check if neighbor is within grid bounds
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    // If neighbor is a mine, increment count
                    if (board[nr][nc] === -1) {
                        mineCount++;
                    }
                }
            });

            board[r][c] = mineCount;
        }
    }

    return board;
}

function createGrid(rows, cols) {
    if (rows <= 0 || cols <= 0 || rows > 30 || cols > 30) {
        document.getElementById("win_or_lose").innerText = "Invalid grid size! Rows and Columns must be between 1 and 30.";
        return;
    }

    grid_element.innerHTML = "";
    
    // Dynamic styling to ensure grid shapes correctly
    grid_element.style.display = "grid";
    grid_element.style.gridTemplateColumns = `repeat(${cols}, 40px)`; // Assuming 40px cells
    grid_element.style.gap = "5px";

    for (let r = 0; r < rows; r++) {
        // We don't strictly need row divs for CSS Grid, but keeping your structure:
        // Note: Standard CSS grid usually applies directly to cells, but this works if styled right.
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            // Basic cell styling for visibility if not in CSS
            cell.style.width = "40px";
            cell.style.height = "40px";
            cell.style.backgroundColor = "#ccc";
            cell.style.display = "flex";
            cell.style.alignItems = "center";
            cell.style.justifyContent = "center";
            
            cell.addEventListener("click", () => revealCell(r, c));
            grid_element.appendChild(cell);
        }
    }
}

function placeMines(rows, cols, mines) {
    // NOTE: Sets don't work well with Arrays in JS ([1,1] !== [1,1]). 
    // Using strings "row,col" to track unique positions reliably.
    let positions = new Set();
    while (positions.size < mines) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        positions.add(`${r},${c}`);
    }
    
    // Convert back to array of arrays for your existing logic
    minePositions = Array.from(positions).map(str => str.split(',').map(Number));
    console.log("Mines placed");
}

function revealCell(row, col) {
    if (!running) return;

    const cols = parseInt(cols_input.value);
    const cellIndex = row * cols + col;
    const clicked_cell = grid_element.children[cellIndex];
    
    // Read the value we calculated earlier
    const value = parseInt(clicked_cell.getAttribute("data-value"));

    if (value === -1) {
        // IT IS A MINE
        document.getElementById("win_or_lose").innerText = "Game Over!";
        clicked_cell.style.backgroundColor = "#f00";
        clicked_cell.innerText = "💣"; // Optional: show bomb icon
        document.body.classList.add("explode");
        
        // Trigger your explosion animation here
        if (typeof explodeGrid === "function") explodeGrid();
        
        running = false;
    } else {
        // IT IS SAFE
        clicked_cell.style.backgroundColor = "#ddd";
        
        if (value === 0) {
             const rows = parseInt(rows_input.value);
             const cols = parseInt(cols_input.value);
             floodFill(row, col, rows, cols);
        } 
        // If it's a number, just reveal that one cell normally
        else {
            clicked_cell.classList.add("revealed");
            clicked_cell.style.backgroundColor = "#ddd";
            clicked_cell.innerText = value;
            if (clicked_cell.innerText === "1") {
                clicked_cell.style.color = "blue";
            } else if (clicked_cell.innerText === "2") {
                clicked_cell.style.color = "green";
            } else if (clicked_cell.innerText === "3") {
                clicked_cell.style.color = "red";
            } else if (clicked_cell.innerText === "4") {
                clicked_cell.style.color = "darkblue";
            } else if (clicked_cell.innerText === "5") {
                clicked_cell.style.color = "brown";
            } else if (clicked_cell.innerText === "6") {
                clicked_cell.style.color = "cyan";
            } else if (clicked_cell.innerText === "7") {
                clicked_cell.style.color = "black";
            } else if (clicked_cell.innerText === "8") {
                clicked_cell.style.color = "gray";
            }
            score++;
            score_element.innerText = score;
        }
    }

    if (score === (parseInt(rows_input.value) * parseInt(cols_input.value)) - minePositions.length) {
        document.getElementById("win_or_lose").innerText = "You Win!";
        running = false;
    }
}

// --- NEW FUNCTION: Dynamic Explosion ---
function explodeGrid() {
    // 1. Get the exact position and size of the current grid
    const rect = grid_element.getBoundingClientRect();
    
    // 2. Create an overlay container
    const container = document.createElement('div');
    container.id = 'explosion-container';
    container.style.top = rect.top + 'px';
    container.style.left = rect.left + 'px';
    container.style.width = rect.width + 'px';
    container.style.height = rect.height + 'px';
    document.body.appendChild(container);

    // 3. Scale explosion spread based on grid size
    // Larger grids = particles travel further
    const maxSpread = Math.max(rect.width, rect.height) * 0.8; 

    const colors = ['#ff4d4d', '#ff9f43', '#feca57', '#ff6b6b'];

    // 4. Generate Particles
    for (let i = 0; i < 60; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        // Random physics
        // Calculate a random angle and distance based on grid size
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * maxSpread;
        
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        const r = Math.random() * 720; // Rotation

        confetti.style.setProperty('--tx', `${tx}px`);
        confetti.style.setProperty('--ty', `${ty}px`);
        confetti.style.setProperty('--r', `${r}deg`);
        confetti.style.setProperty('--color', colors[Math.floor(Math.random() * colors.length)]);

        container.appendChild(confetti);

        // Animate
        requestAnimationFrame(() => confetti.classList.add('animate'));
    }

    // 5. Cleanup DOM after animation ends
    setTimeout(() => {
        container.remove();
    }, 1200);
}

function floodFill(r, c, rows, cols) {
    // 1. BOUNDARY CHECK: standard check to ensure we don't try to look outside the grid
    if (r < 0 || r >= rows || c < 0 || c >= cols) {
        return;
    }

    // 2. GET CELL: Identify the HTML element
    const cellIndex = r * cols + c;
    const cell = grid_element.children[cellIndex];

    // 3. STOP CONDITIONS: 
    // If already revealed or flagged, do nothing. 
    // (Checking 'revealed' class prevents infinite loops!)
    if (cell.classList.contains("revealed")) {
        return;
    }

    // 4. REVEAL THE CELL
    cell.classList.add("revealed");
    cell.style.backgroundColor = "#ddd"; // Visual style for revealed
    score++;
    score_element.innerText = score;
    
    // Get the hidden number
    const value = parseInt(cell.getAttribute("data-value"));

    // 5. HANDLE NON-ZERO NUMBERS (The "Walls")
    if (value > 0) {
        cell.innerText = value;
        if (cell.innerText === "1") {
            cell.style.color = "blue";
        } else if (cell.innerText === "2") {
            cell.style.color = "green";
        } else if (cell.innerText === "3") {
            cell.style.color = "red";
        } else if (cell.innerText === "4") {
            cell.style.color = "darkblue";
        } else if (cell.innerText === "5") {
            cell.style.color = "brown";
        } else if (cell.innerText === "6") {
            cell.style.color = "cyan";
        } else if (cell.innerText === "7") {
            cell.style.color = "black";
        } else if (cell.innerText === "8") {
            cell.style.color = "gray";
        }
        // Optional: Add colors again here if you want
        return; // STOP! Don't look at neighbors of a number.
    }

    // 6. HANDLE ZEROS (The "Floor")
    // If value is 0, we recurse (call this function again) for all 8 neighbors
    // We don't need to write innerText because 0s are usually blank.
    
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];

    for (let i = 0; i < directions.length; i++) {
        const dr = directions[i][0];
        const dc = directions[i][1];
        // RECURSION: The function calls itself!
        floodFill(r + dr, c + dc, rows, cols);
    }
}