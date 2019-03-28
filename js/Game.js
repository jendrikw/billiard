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

        //every ball gets a number
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

        // cue spawns on the ball
        this.cue = new Cue(this, this.balls[0]);
        this.nonoSuckingSound = document.getElementById("nono_sucking_audio");
        if(this.nonoSuckingSound == null) {
            throw new TypeError("Nono's sound is not available.");
        }
        this.nonoSuckingSound.volume = 1.0;

        this.nonoSuckingGif = document.getElementById("nono_sucking_gif");

        // Change endGameText and show the rest of the game without allowing to play.
        this.afterGameOptions = document.getElementById("after-game-block");
        this.afterGameText = document.getElementById("after-game-header");
        this.afterGameOptions.style.display = "none";
        this.afterGameText.style.display = "none";

        //get the score-button and add an eventlistener to it
        this.scoresButton = document.getElementById("scores");
        if(this.scoresButton == null) {
        	throw new TypeError("The score-button is not available.");
        }
        this.scoresButton.addEventListener("click", () => Game.redirectToScores());

        //get the playername and add an eventlistener to it
        this.playerNameInput = document.getElementById("playername");

        //add an eventlistener to the send button
        this.saveScoreButton = document.getElementById("send");
        if(this.scoresButton == null) {
            throw new TypeError("The save-score-button is not available.");
        }
        this.saveScoreButton.addEventListener("click", () => this.saveScore());

        //add an eventlistener to the pause button
        this.pauseButton = document.getElementById("pause");
        if(this.pauseButton == null) {
            throw new TypeError("The pause-button is not available.");
        }
        this.pauseButton.removeEventListener("click", this.internalTogglePaused);
        this.pauseButton.addEventListener("click", this.internalTogglePaused = () => this.togglePaused());
        if (this.isPaused) {
            this.togglePaused();
        }
        //Buttons to start a new game
        this.startNewGameButtons = document.getElementsByClassName("new-game");
        if(this.startNewGameButtons == null) {
            throw new TypeError("The startNewGame-button is not available.");
        }
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
        this.score = this.ballsInHole * 200 - (this.bumps * 10 + this.fouls * 50); // Negative score is allowed.
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
        console.log("You shot.");
    }

    handleGameWon(lastHoledBallIsBlack) {
        this.ballsInHole++;
        this.playNono(); // play a GIF

        // Check, game won or not (black ball):
        if (this.ballsInHole === this.numberOfBalls) {
            this.afterGameText.innerHTML = "Gewonnen";
            this.end();
            console.log("This is the end of the game. You won!");
        }
        if (this.ballsInHole < this.numberOfBalls && lastHoledBallIsBlack) {
            this.afterGameText.innerHTML = "Verloren";
            this.end();
            console.log("This is the end of the game. You lost!");
        }

        this.redrawTable();
    }

    end() {
        //operations to end the game and open the "game ended screen"
        this.calculateScore();
        this.redrawTable();
        this.cue.kill();
        this.afterGameOptions.style.display = "block";
        this.afterGameText.style.display = "block";
    }

    playNono() {
        //Play meme when ball is in the hole
        this.nonoSuckingSound.pause();
        this.nonoSuckingSound.currentTime = 0;
        this.nonoSuckingSound.play();

        this.nonoSuckingGif.style.display = "block";
        this.nonoSuckingSound.addEventListener("ended", () => {
            this.nonoSuckingGif.style.display = "none";
        });
    }

    startANewGame() {
        console.log("A new game was started.");
        this.afterGameOptions.style.display = "block";
        for (let ball of this.balls) {
            // requestAnimationFrame für die Bälle vom alten Spiel verhindern:
            ball.kill();
        }
        this.start();
    }

    // For white ball. Foul. Wait until all balls are stopped:
    notifyBallStopped() {
        if (!this.areAnyBallsMoving() && this.balls[0].isFoul) {
            // reset white ball

            this.balls[0].x = Table.WHITE_BALL_X;
            this.balls[0].y = Table.Y_MIDDLE;

            this.handleCollisionAfterReset();
            this.balls[0].draw();
            this.balls[0].isFoul = false;
        }
    }

    handleCollisionAfterReset() {
        // this function finds a position for the white ball after a foul
        let whiteBallCantBeDrawn = true;
        let yDelta = Ball.RADIUS * 1.5;

        //if the white ball had a foul and is resetting on the place and the place is not empty, than the ball is changing the place where it spawn
        while (whiteBallCantBeDrawn) {
            let counter = 0;
            // Check collision after reset white ball.
            for (let ball of this.balls) {
                if (this.balls[0].y >= Table.Y_BOTTOM) {
                    this.balls[0].y = Table.Y_MIDDLE;
                    yDelta *= -1;
                }
                if (this.balls[0].checkFoulCollision(ball)) {
                    this.balls[0].y += yDelta;
                    counter++;
                }
            }
            if (counter === 0) {
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
        const newScore = {name, score: this.score};
        scores.scores.push(newScore);
        localStorage.setItem("scores", JSON.stringify(scores));
        console.log("Saved score: ", newScore);
        Game.redirectToScores();
    }

    togglePaused() {
        this.isPaused = !this.isPaused;
        this.pauseButton.classList.toggle("isPaused");
        console.log("Pause button clicked.");
    }
}


