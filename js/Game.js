'use strict';

class Game {
    constructor() {
        this.table = new Table();
        this.balls = [];
        this.balls[0] = new Ball(this, 300, 300);
        for (let i = 1; i <= 15; i++) {
            this.balls[i] = new Ball(this, 100 + 20 * i, 200, i + 1);
        }
        this.cue = new Cue(this.balls[0]);
        this.ballContext = getContext("ball-canvas");
    }

    drawAll() {
        this.table.draw();
        this.drawBalls();
    }
    
    drawBalls() {
        this.ballContext.clearRect(0, 0, this.ballContext.canvas.width, this.ballContext.canvas.height);
        for (let b of this.balls) {
            b.draw();
        }
    }
}
