'use strict';

class Game {
    constructor() {
    	this.ballContext = getContext("ball-canvas");
    }

    start() {
    	this.numberOfBalls = 2;
    	this.ballsInHole = 0;
        this.table = new Table();
        this.balls = [];
        this.balls[0] = new Ball(this, 320, 250);
        for (let i = 1; i <= this.numberOfBalls; i++) {
            this.balls[i] = new Ball(this, 100 + 220 * i, 200, i);
            //this.balls[2] = new Ball(this, 100 + 220 * 1, 370, 2);
        }

        this.cue = new Cue(this, this.balls[0]);
    	
        this.table.draw();
        this.drawBalls();
    }

    drawBalls() {
        this.ballContext.clearRect(0, 0, this.ballContext.canvas.width, this.ballContext.canvas.height);
        for (let b of this.balls) {
            b.draw();
        }
        window.requestAnimationFrame(() => this.drawBalls());
    }

    areAnyBallsMoving() {
        return this.balls.some(b => b.isMoving);
    }
    
    startANewGame() {
    	for (let ball of this.balls) {
    		// requestAnimationFrame für die Bälle vom alten Spiel verhindern:
    		ball.kill();
    	}
    	this.start();
    }
    
    handleGameWon() {
    	this.ballsInHole++;
    	
    	if(this.ballsInHole == this.numberOfBalls) {
    		this.startANewGame();
    	}
    }

}
