'use strict';

class Game {
    constructor() {
        this.ballContext = getContext("ball-canvas");
    }

    start() {
        this.numberOfBalls = 15;
        this.ballsInHole = 0;
        this.table = new Table(this);
        this.balls = [];
        this.balls[0] = new Ball(this, 320, 250);
        for (let i = 1; i <= this.numberOfBalls; i++) {
        	this.balls[i] = new Ball(this, 100 + 20 * i, 200, i);
        	//this.balls[1] = new Ball(this, 100 + 220 * 1, 200, 1);
        	//this.balls[2] = new Ball(this, 100 + 220 * 1, 370, 2);
        	//this.balls[3] = new Ball(this, 50, 370, 6);
        }

        this.cue = new Cue(this, this.balls[0]);
        this.nonoSuckingSound = document.getElementById("nono_sucking_audio");
        this.nonoSuckingSound.volume = 1.0;

        this.nonoSuckingGif = document.getElementById("nono_sucking_gif");

        this.fouls = 0;
        this.bumps = 0;
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
    
    incrementFouls() {
    	this.fouls++;
    }
    incrementBumps() {
    	this.bumps++;
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
        this.nonoSuckingSound.pause();
        this.nonoSuckingSound.currentTime = 0;
        this.nonoSuckingSound.play();

        this.nonoSuckingGif.style.display = "block";
        this.nonoSuckingSound.addEventListener("ended", () => {this.nonoSuckingGif.style.display = "none";});

        if (this.ballsInHole == this.numberOfBalls) {
            this.startANewGame();
        }
        this.redrawTable();
    }

    redrawTable() {
        this.table.draw();
    }
}
