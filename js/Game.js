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
        this.balls[0] = new Ball(this, Table.WHITE_BALL_X, Table.Y_MIDDLE);
        for (let i = 1; i <= this.numberOfBalls; i++) {
        	this.balls[i] = new Ball(this, 0, 0, i);
        }

        let ballNumbers = [9, 7, 12, 15, 8, 1, 6, 10, 3, 14, 11, 2, 13, 4, 5];
        let i = 0;
        for (let x = 0; x > -5; x--) {
            let yMin = 0.5 * x;
            let yMax = -0.5 * x;
            for (let y = yMin; y <= yMax; y++) {
                let ballIndex = ballNumbers[i];
                i++;
                this.balls[ballIndex].x = Table.APEX_BALL_X + x * 2 * Ball.RADIUS;
                this.balls[ballIndex].y = Table.Y_MIDDLE + y * 2.1 * Ball.RADIUS;
            }
        }

        this.cue = new Cue(this, this.balls[0]);
        this.nonoSuckingSound = document.getElementById("nono_sucking_audio");
        this.nonoSuckingSound.volume = 1.0;

        this.nonoSuckingGif = document.getElementById("nono_sucking_gif");

        this.afterGameOptions = document.getElementById("after-game-block");
        this.afterGameOptions.style.display = "none";

        this.newGameButton = document.getElementById("new-game");
        this.newGameButton.addEventListener("click", () => this.startANewGame());

        this.scoresButton = document.getElementById("scores");
        this.scoresButton.addEventListener("click", () => Game.redirectToScores());

        this.fouls = 0;
        this.bumps = 0;
        this.score = 0;
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
        this.afterGameOptions.style.display = "block";
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

        if (this.ballsInHole === this.numberOfBalls) {
            this.end();
        }
        this.redrawTable();
    }

    calculateScore() {
    	this.score = this.ballsInHole * 200 - (this.bumps*25 + this.fouls*75); // Negative score is allowed.
    }

    notifyBallStopped() {
    	if(!this.areAnyBallsMoving() && this.balls[0].isFoul) {
    		// reset white ball
    	    this.balls[0].x = Table.WHITE_BALL_X;
    		this.balls[0].y = Table.Y_MIDDLE;
    		this.balls[0].draw();
    		this.balls[0].isFoul = false;
    	}
    }

    redrawTable() {
    	this.calculateScore();
        this.table.draw();
    }

    end() {
        this.calculateScore();
        this.redrawTable();
        this.cue.kill();
        this.afterGameOptions.style.display = "block";
    }

    static redirectToScores() {
        window.location = "./score.html";
    }
}
