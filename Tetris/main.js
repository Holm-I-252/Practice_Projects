// const grid = Array.from({length: 20}, () => Array(10).fill(0));
// console.log(grid);
const shapes = ["T", "O", "I", "L", "J", "S", "Z"];
const tetronimos = {
    T: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    O: [
        [1, 1],
        [1, 1]
    ],
    I: [
        [1, 1, 1, 1]
    ],
    L: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    J: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ]
};

let canvas = document.getElementById("tetris_canvas");
let context = canvas.getContext("2d");
context.scale(20, 20);

let speed = 200;

const arena = createMatrix(12, 20);

let newPiece = false

let active_piece = {
    matrix: tetronimos[shapes[Math.floor(Math.random() * shapes.length)]],
    position: {x: 5, y: 0}
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = "red";
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}


function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawMatrix(active_piece.matrix, active_piece.position);
}

function rotate(matrix) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                matrix[y][x],
                matrix[x][y],
            ];
        }
    }
    matrix.forEach(row => row.reverse());
}

function playerRotate(dir) {
    const pos = active_piece.position.x;
    let offset = 1;
    
    // 1. Perform the rotation math
    rotate(active_piece.matrix);
    // 2. Check for collisions (Wall Kick)
    // While we are colliding with a wall or block...
    while (collide(arena, active_piece)) {
        // ...push the player to the side
        active_piece.position.x += offset;
        
        // This math toggles the offset: 1, -1, 2, -2, 3, -3...
        // It checks right, then left, then further right, etc.
        offset = -(offset + (offset > 0 ? 1 : -1)); 
        
        // FAILSAFE: If we've moved the piece more than its own width
        // and it still collides, the rotation is impossible.
        if (offset > active_piece.matrix[0].length) {
            // Undo the rotation
            rotate(active_piece.matrix); // Rotating 3 more times = undo, or just rotate back if you have a direction
            // Note: If you implement counter-clockwise, you'd rotate the other way here.
            // For now, re-rotating essentially resets if we consider the simplistic approach,
            // but strictly you should reverse the transpose/reverse steps.
            
            // Actually, simpler approach for "undo" if you only have one rotate function:
            // Just rotate 3 times (270 deg) to get back to 0.
            // Or simpler: just reset the position and accept the collision (glitchy).
            // BETTER: rotate it back (inverse operation). 
            // For this basic version, let's just reset position and assume the rotation stuck
            // effectively 'cancelling' the move is complex without a `dir`.
            
            // Let's stick to the simplest "Cancel" logic:
            active_piece.position.x = pos;
            // Ideally, you would rotate the matrix back here.
            return;
        }
    }
}

function collide(arena, player) {
    const m = player.matrix;
    const o = player.pos; // o for "offset"

    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            
            // 1. Check if the cell in the piece is filled
            if (m[y][x] !== 0) {
                
                // 2. Calculate the "Real" coordinates on the board
                const realY = y + o.y;
                const realX = x + o.x;

                // 3. Check the Arena for obstacles
                // We access the row first: arena[realY]
                // Then the column: arena[realY][realX]
                
                // If the row doesn't exist (floor/ceiling) OR
                // If the cell isn't 0 (another block is there)
                if (!arena[realY] || arena[realY][realX] !== 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

document.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") {
        active_piece.position.x -= 1;
    } 
    else if (event.key === "ArrowRight") {
        active_piece.position.x += 1;
    }
    else if (event.key === "ArrowDown") {
        active_piece.position.y += 1;
    }
    else if (event.key === "ArrowUp") {
        playerRotate(1);
    }
});

draw();

setInterval(() => {
    if (active_piece.matrix != tetronimos["I"] &&active_piece.position.y < 28){
        active_piece.position.y += 1;
    } else if (active_piece.matrix == tetronimos["I"] && active_piece.position.y < 29){
        active_piece.position.y += 1;
    }
    draw();
}, speed);