class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.restartBtn = document.getElementById('restartBtn');

        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;

        this.snake = [
            { x: 10, y: 10 }
        ];
        this.food = this.generateFood();
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.gameRunning = true;

        this.bindEvents();
        this.gameLoop();
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => this.changeDirection(e));
        this.restartBtn.addEventListener('click', () => this.restart());
    }

    generateFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (this.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
        return newFood;
    }

    changeDirection(e) {
        if (!this.gameRunning) return;

        const keyPressed = e.keyCode;
        const goingUp = this.dy === -1;
        const goingDown = this.dy === 1;
        const goingRight = this.dx === 1;
        const goingLeft = this.dx === -1;

        if (keyPressed === 37 && !goingRight) { // Left
            this.dx = -1;
            this.dy = 0;
        }
        if (keyPressed === 38 && !goingDown) { // Up
            this.dx = 0;
            this.dy = -1;
        }
        if (keyPressed === 39 && !goingLeft) { // Right
            this.dx = 1;
            this.dy = 0;
        }
        if (keyPressed === 40 && !goingUp) { // Down
            this.dx = 0;
            this.dy = 1;
        }
    }

    clearCanvas() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawFood() {
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.shadowColor = '#ff6b6b';
        this.ctx.shadowBlur = 10;
        this.ctx.fillRect(
            this.food.x * this.gridSize + 2,
            this.food.y * this.gridSize + 2,
            this.gridSize - 4,
            this.gridSize - 4
        );
        this.ctx.shadowBlur = 0;
    }

    drawSnake() {
        this.ctx.fillStyle = '#4ecdc4';
        this.ctx.shadowColor = '#4ecdc4';
        this.ctx.shadowBlur = 5;
        
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                this.ctx.fillStyle = '#45b7aa';
            } else {
                this.ctx.fillStyle = '#4ecdc4';
            }
            
            this.ctx.fillRect(
                segment.x * this.gridSize + 1,
                segment.y * this.gridSize + 1,
                this.gridSize - 2,
                this.gridSize - 2
            );
        });
        this.ctx.shadowBlur = 0;
    }

    moveSnake() {
        if (this.dx === 0 && this.dy === 0) return;
        
        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };
        
        this.snake.unshift(head);

        const didEatFood = this.snake[0].x === this.food.x && this.snake[0].y === this.food.y;
        if (didEatFood) {
            this.score += 10;
            this.scoreElement.textContent = this.score;
            this.food = this.generateFood();
        } else {
            this.snake.pop();
        }
    }

    checkGameEnd() {
        for (let i = 4; i < this.snake.length; i++) {
            if (this.snake[i].x === this.snake[0].x && this.snake[i].y === this.snake[0].y) {
                return true;
            }
        }

        // Wrap around walls
        if (this.snake[0].x < 0) {
            this.snake[0].x = this.tileCount - 1;
        }
        if (this.snake[0].x >= this.tileCount) {
            this.snake[0].x = 0;
        }
        if (this.snake[0].y < 0) {
            this.snake[0].y = this.tileCount - 1;
        }
        if (this.snake[0].y >= this.tileCount) {
            this.snake[0].y = 0;
        }

        return false;
    }

    gameOver() {
        this.gameRunning = false;
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2 - 20);
        
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
    }

    restart() {
        this.snake = [{ x: 10, y: 10 }];
        this.food = this.generateFood();
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.scoreElement.textContent = this.score;
        this.gameRunning = true;
    }

    gameLoop() {
        setTimeout(() => {
            if (this.gameRunning) {
                this.clearCanvas();
                this.drawFood();
                this.moveSnake();

                if (this.checkGameEnd()) {
                    this.gameOver();
                } else {
                    this.drawSnake();
                }
            }
            this.gameLoop();
        }, 1000 / 15);
    }
}

window.addEventListener('load', () => {
    new SnakeGame();
});