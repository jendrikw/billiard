'use strict';

class Game {
    constructor() {
        this.ballContext = getContext("ball-canvas");
    }

    start() {
		//initialisation from the balls on the Table
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

        // Change endGameText and show the rest of the game without allowing to play.
        this.afterGameOptions = document.getElementById("after-game-block");
        this.afterGameText = document.getElementById("after-game-header");
        this.afterGameOptions.style.display = "none";
        this.afterGameText.style.display = "none";

        this.scoresButton = document.getElementById("scores");
        this.scoresButton.addEventListener("click", () => Game.redirectToScores());

        this.playerNameInput = document.getElementById("playername");

        this.saveScoreButton = document.getElementById("send");
        this.saveScoreButton.addEventListener("click", () => this.saveScore());

        this.pauseButton = document.getElementById("pause");
        this.pauseButton.addEventListener("click", () => this.togglePaused());

        this.startNewGameButtons = document.getElementsByClassName("new-game");
        for (let button of this.startNewGameButtons) {
            button.addEventListener("click", () => {
                this.cue.kill();
                this.startANewGame();
            });
        }

        this.fouls = 0;
        this.bumps = 0;
        this.score = 0;
        this.ballIsBlack = false;
        this.table.draw();
        this.isPaused = false;
        this.drawBalls();
    }    
    
    calculateScore() {
    	this.score = this.ballsInHole * 200 - (this.bumps*10 + this.fouls*50); // Negative score is allowed.
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

    handleGameWon() {
        this.ballsInHole++;
        this.playNono(); // play a GIF

        // Check, game won or not (black ball):
        if((this.ballsInHole < this.numberOfBalls) && (this.ballIsBlack)) {
        	this.afterGameText.innerHTML = "Verloren";
        	this.end();
        }
        if (this.ballsInHole === this.numberOfBalls) {
        	this.afterGameText.innerHTML = "Gewonnen";
            this.end();
        }
        this.redrawTable();
    }
    
    end() {
        this.calculateScore();
        this.redrawTable();
        this.cue.kill();
        this.afterGameOptions.style.display = "block";
        this.afterGameText.style.display = "block";
    }
    
    playNono() {
    	this.nonoSuckingSound.pause();
        this.nonoSuckingSound.currentTime = 0;
        this.nonoSuckingSound.play();

        this.nonoSuckingGif.style.display = "block";
        this.nonoSuckingSound.addEventListener("ended", () => {this.nonoSuckingGif.style.display = "none";});
    }
    
    startANewGame() {
        this.afterGameOptions.style.display = "block";
        for (let ball of this.balls) {
            // requestAnimationFrame für die Bälle vom alten Spiel verhindern:
            ball.kill();
        }
        this.start();
    }

    // For white ball. Foul. Wait until all balls are stopped:
    notifyBallStopped() {
    	if(!this.areAnyBallsMoving() && this.balls[0].isFoul) {
    		// reset white ball
    		
    		this.balls[0].x = Table.WHITE_BALL_X;
    		this.balls[0].y = Table.Y_MIDDLE;
    		
    		this.handleCollisionAfterReset();
    		this.balls[0].draw();
    		this.balls[0].isFoul = false;
    	}
    }

    handleCollisionAfterReset() {
    	let isFoulCollision = false;
		let whiteBallCantBeDrawn = true;
		let yDelta = Ball.RADIUS * 1.5;
		
    	while(whiteBallCantBeDrawn) {
			let counter = 0;
			// Check collision after reset white ball.
    		for (let ball of this.balls) {
    			isFoulCollision = this.balls[0].checkFoulCollision(ball);
    			if(this.balls[0].y >= Table.Y_BOTTOM) {
					this.balls[0].y = Table.Y_MIDDLE;
					yDelta *= -1; 
				}
    			if(isFoulCollision) {
    				this.balls[0].y += yDelta;
    				counter++;
    			}
    			isFoulCollision = false;
			}
    		if(counter === 0) {
    			whiteBallCantBeDrawn = false;
    		}
    		
		}
    }
    
    redrawTable() {
    	this.calculateScore();
        this.table.draw();
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

    togglePaused() {
        this.isPaused = !this.isPaused;
        this.pauseButton.classList.toggle("isPaused");
    }
}


