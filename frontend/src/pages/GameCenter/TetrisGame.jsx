import React from "react";
import './TetrisGame.css';
import DivCol from "../../components/DivCol";

export default function TestGame1() {
    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        if (!HTMLCanvasElement.prototype.getContext) {
            alert('Canvas not supported in your browser');
            return;
        }
        new TetrisGame(canvasRef.current);
    }, []);

    return (
        <>
            <link rel="stylesheet" href="./TetrisGame.css" />
            <div aria-labelledby="gameHeading" role="main" className="game-container">
                <h1 id="gameHeading" className="visually-hidden">Tetris Game</h1>
                    <canvas ref={canvasRef} width="300" height="600" 
                            role="img" aria-label="Tetris game board">
                    </canvas>
                    <DivCol>
                        <aside className="game-info" aria-live="polite">
                            <div>Score: <output id="score">0</output></div>
                            <div>High Score: <output id="highscore">0</output></div>
                            <button id="pauseBtn" type="button">Pause</button>
                        </aside>
                        <div className="controls" role="navigation" aria-label="Game controls">
                            <h2 className="visually-hidden">Controls</h2>
                            <ul>
                                <li><kbd>A</kbd> to move left</li>
                                <li><kbd>D</kbd> to move right</li>
                                <li><kbd>S</kbd> to drop</li>
                                <li><kbd>Space</kbd> to hard drop</li>
                                <li><kbd>Q</kbd> to rotate left</li>
                                <li><kbd>E</kbd> to rotate right</li>
                            </ul>
                        </div>
                    </DivCol>
                    
            </div>
        </>
    );
  }

  class TetrisGame {
    static SHAPES = [
        [[1,1,1,1]], // I
        [[1,1],[1,1]], // O
        [[1,1,1],[0,1,0]], // T
        [[1,1,1],[1,0,0]], // L
        [[1,1,1],[0,0,1]], // J
        [[1,1,0],[0,1,1]], // S
        [[0,1,1],[1,1,0]]  // Z
    ];
    static COLORS = ['#FF0D72', '#0DC2FF', '#0DFF72', 
                    '#F538FF', '#FF8E0D', '#FFE138', '#3877FF'];

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.grid = Array(20).fill().map(() => Array(10).fill(0));
        this.score = 0;
        this.highScore = localStorage.getItem('tetrisHighScore') || 0;
        this.currentPiece = null;
        this.gameOver = false;
        this.lastDrop = 0;
        this.dropInterval = 1000;
        
        this.init();
    }

    init() {
        this.resizeCanvas();
        this.spawnPiece();
        document.addEventListener('keydown', this.handleInput.bind(this));
        this.updateScore();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    resizeCanvas() {
        const scale = window.devicePixelRatio;
        this.canvas.style.width = `${this.canvas.width}px`;
        this.canvas.style.height = `${this.canvas.height}px`;
        this.canvas.width = this.canvas.width * scale;
        this.canvas.height = this.canvas.height * scale;
        this.ctx.scale(scale, scale);
    }

    gameLoop(timestamp) {
        if (this.gameOver) return;
        
        if (timestamp - this.lastDrop > this.dropInterval) {
            this.drop();
            this.lastDrop = timestamp;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGridLines();
        this.drawBlocks();
        this.drawPreview();
        this.drawPiece();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    drawGridLines() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x <= 10; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * 30, 0);
            this.ctx.lineTo(x * 30, 600);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y <= 20; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * 30);
            this.ctx.lineTo(300, y * 30);
            this.ctx.stroke();
        }
    }

    drawBlocks() {
        this.grid.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    this.ctx.fillStyle = TetrisGame.COLORS[value - 1];
                    this.ctx.fillRect(x * 30 + 1, y * 30 + 1, 28, 28);
                }
            });
        });
    }

    drawPiece() {
        if (!this.currentPiece) return;
        this.ctx.fillStyle = this.currentPiece.color;
        this.drawTetromino(this.currentPiece.x, this.currentPiece.y);
    }

    drawPreview() {
        if (!this.currentPiece) return;
        const dropDistance = this.getDropDistance();
        if (dropDistance > 0) {
            this.ctx.globalAlpha = 0.3;
            this.ctx.fillStyle = this.currentPiece.color;
            this.drawTetromino(this.currentPiece.x, this.currentPiece.y + dropDistance);
            this.ctx.globalAlpha = 1.0;
        }
    }

    drawTetromino(x, y) {
        this.currentPiece.shape.forEach((row, dy) => {
            row.forEach((value, dx) => {
                if (value) {
                    const px = (x + dx) * 30 + 1;
                    const py = (y + dy) * 30 + 1;
                    this.ctx.fillRect(px, py, 28, 28);
                }
            });
        });
    }

    getDropDistance() {
        if (!this.currentPiece) return 0;
        let dropDistance = 0;
        while (!this.collision(0, dropDistance + 1)) {
            dropDistance++;
        }
        return dropDistance;
    }

    spawnPiece() {
        const type = Math.floor(Math.random() * TetrisGame.SHAPES.length);
        this.currentPiece = {
            shape: TetrisGame.SHAPES[type],
            color: TetrisGame.COLORS[type],
            x: Math.floor(10/2) - Math.floor(TetrisGame.SHAPES[type][0].length/2),
            y: 0
        };
    }

    move(dx) {
        if (!this.collision(dx, 0)) {
            this.currentPiece.x += dx;
        }
    }

    drop() {
        if (!this.collision(0, 1)) {
            this.currentPiece.y++;
            return;
        }
        
        this.lockPiece();
        this.clearLines();
        this.spawnPiece();
        if (this.collision(0, 0)) {
            this.gameOver = true;
            alert('Game Over!');
        }
    }

    collision(dx, dy) {
        return this.currentPiece.shape.some((row, y) => 
            row.some((value, x) => {
                if (!value) return false;
                const nx = this.currentPiece.x + x + dx;
                const ny = this.currentPiece.y + y + dy;
                return nx < 0 || nx >= 10 || ny >= 20 || 
                        (ny >= 0 && this.grid[ny]?.[nx]);
            })
        );
    }

    lockPiece() {
        this.currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    const gy = this.currentPiece.y + y;
                    const gx = this.currentPiece.x + x;
                    if (gy >= 0) this.grid[gy][gx] = 
                        TetrisGame.COLORS.indexOf(this.currentPiece.color) + 1;
                }
            });
        });
    }

    clearLines() {
        let lines = 0;
        for (let y = this.grid.length - 1; y >= 0; y--) {
            if (this.grid[y].every(cell => cell)) {
                this.grid.splice(y, 1);
                this.grid.unshift(Array(10).fill(0));
                lines++;
                y++;
            }
        }
        if (lines) {
            this.score += [40, 100, 300, 1200][lines - 1];
            this.updateScore();
        }
    }

    updateScore() {
        document.getElementById('score').textContent = this.score;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('tetrisHighScore', this.highScore);
        }
        document.getElementById('highscore').textContent = this.highScore;
    }

    handleInput(event) {
        const controls = {
            KeyA: () => this.move(-1),
            KeyD: () => this.move(1),
            KeyS: () => this.drop(),
            Space: () => this.hardDrop(),
            KeyQ: () => this.rotate(-1),
            KeyE: () => this.rotate(1)
        };
        
        if (controls[event.code]) {
            event.preventDefault();
            controls[event.code]();
        }
    }

    hardDrop() {
        const dropDistance = this.getDropDistance();
        if (dropDistance > 0) {
            this.currentPiece.y += dropDistance;
            this.score += dropDistance * 2;
            this.updateScore();
            this.lockPiece();
            this.clearLines();
            this.spawnPiece();
            
            if (this.collision(0, 0)) {
                this.gameOver = true;
                alert('Game Over!');
            }
        }
    }

    rotate(dir) {
        const piece = this.currentPiece;
        const rotated = piece.shape[0].map((_, i) =>
            piece.shape.map(row => row[i])
        );
    
        // Reverse rows for clockwise or counterclockwise rotation
        if (dir === 1) {
            rotated.forEach(row => row.reverse());
        } else if (dir === -1) {
            rotated.reverse();
        }
    
        const originalShape = piece.shape;
        piece.shape = rotated;
        if (this.collision(0, 0)) {
            piece.shape = originalShape;
        }
    }
}