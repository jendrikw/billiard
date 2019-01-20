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

        // this.balls[1] = new Ball(this, 320, 360, 1);
        //this.balls[2] = new Ball(this, 320, 110, 8);
        //this.balls[3] = new Ball(this, Table.WHITE_BALL_X, Table.Y_MIDDLE, 3);
        
        
        this.cue = new Cue(this, this.balls[0]);
        this.nonoSuckingSound = document.getElementById("nono_sucking_audio");
        this.nonoSuckingSound.volume = 1.0;

        this.nonoSuckingGif = document.getElementById("nono_sucking_gif");

        // Change endGameText and show the rest of the game without allowing to play. 
        this.afterGameOptions = document.getElementById("after-game-block");
        this.afterGameText = document.getElementById("after-game-header");
        this.afterGameOptions.style.display = "none";
        this.afterGameText.style.display = "none";

        this.newGameButton = document.getElementById("new-game");
        this.newGameButton.addEventListener("click", () => this.startANewGame());

        this.scoresButton = document.getElementById("scores");
        this.scoresButton.addEventListener("click", () => Game.redirectToScores());

        this.playerNameInput = document.getElementById("playername");

        this.saveScoreButton = document.getElementById("send");
        this.saveScoreButton.addEventListener("click", () => this.saveScore());

        this.fouls = 0;
        this.bumps = 0;
        this.score = 0;
        this.ballIsBlack = false;
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

        // Check, game won or not (black ball):
        if((this.ballsInHole < this.numberOfBalls) && (this.ballIsBlack)) {
        	this.afterGameText.innerHTML = "Verloren";;
        	this.end();
        }
        if (this.ballsInHole === this.numberOfBalls) {
        	this.afterGameText.innerHTML = "Gewonnen";
            this.end();
        }
        this.redrawTable();
    }

    calculateScore() {
    	this.score = this.ballsInHole * 200 - (this.bumps*10 + this.fouls*50); // Negative score is allowed.
    }

    // For white ball. Foul. Wait until all balls are stopped:
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
        this.afterGameText.style.display = "block";
    }

    static redirectToScores() {
        window.location = "./score.html";
    }

    saveScore() {
        const name = this.playerNameInput.value;
        let scores = localStorage.getItem("scores");
        if (scores === null) {
            scores = {scores: []};
        } else {
            scores = JSON.parse(scores);
        }
        scores.scores.push({name, score: this.score});
        localStorage.setItem("scores", JSON.stringify(scores));
        Game.redirectToScores();
    }

}


