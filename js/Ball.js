'use strict';

class Ball {

    constructor(game, x, y, number) {
    	this.game = game;
        this.context = getContext("ball-canvas");
        // the constructor for the white ball gets called with 3 arguments, because it has no number
        if (number === undefined) {
            this.color = "white";
        } else {
            this.color = Ball.getColorForNumber(number);
        }
        this.number = number;
        this.x = x;
        this.y = y;
        this.v = new Vector(0, 0);
        this.isMoving = false;
        this.isBeingKilled = false;
        this.isFoul = false;
        this.clickAudio = document.getElementById("click_audio");
    }

    static getColorForNumber(number) {
        return {
            1: "yellow",
            2: "blue",
            3: "red",
            4: "purple",
            5: "orange",
            6: "darkgreen",
            7: "maroon",
            8: "black",
            9: "yellow",
            10: "blue",
            11: "red",
            12: "purple",
            13: "orange",
            14: "darkgreen",
            15: "maroon",
        }[number];
    }

    hasWhiteDot() {
        return 9 <= this.number && this.number <= 15;
    }

    draw() {
        this.context.beginPath();
        this.context.fillStyle = this.color;
        this.context.arc(this.x, this.y, Ball.RADIUS, 0, 2 * Math.PI);
        this.context.fill();
        this.context.closePath();
        if (this.hasWhiteDot()) {
            this.context.beginPath();
            this.context.fillStyle = "white";
            this.context.strokeStyle = "black";
            this.context.lineWidth = 0.5;
            this.context.arc(this.x, this.y, Ball.RADIUS * 0.4, 0, 2 * Math.PI);
            this.context.fill();
            this.context.stroke();
            this.context.closePath();
        }
    }

    moveStep() {
        this.v.scale(0.99);

        if (this.isBeingKilled || this.shouldStopMoving()) {
        	this.game.notifyBallStopped();
            return;
        }

        this.handleCushionCollision();

        for (const ball of this.game.balls) {
            if (this === ball) {
                continue;
            }
            this.handleBallCollision(ball);
        }

        // hole collision:
        const isInHole = this.checkHoleCollision();
        if (isInHole) {
            if (this.color === "white") {
                this.game.incrementFouls();
                this.game.redrawTable();
                this.isFoul = true;
                this.x = 2000;
                this.y = 2000;
                this.v = new Vector(0, 0);
                this.isMoving = false;
            } else if (this.color === "black") {
                this.remove();
                this.game.ballIsBlack = true;
                this.game.handleGameWon();
            } else {
                this.remove();
                this.game.handleGameWon();
            }
        }

        this.x += this.v.x;
        this.y += this.v.y;
        window.requestAnimationFrame(() => this.moveStep());
    }

    shouldStopMoving() {
    	if (Math.abs(this.v.x) < 0.1 && Math.abs(this.v.y) < 0.1) {
    	    this.v = new Vector(0, 0);
            this.isMoving = false;
            return true;
        }
        return false;
    }

    handleCushionCollision() {
    	if (this.x + this.v.x - Ball.RADIUS <= Table.X_LEFT || this.x + this.v.x + Ball.RADIUS >= Table.X_RIGHT) {
            this.v.x *= -1;
        }
        if (this.y + this.v.y - Ball.RADIUS <= Table.Y_TOP || this.y + this.v.y + Ball.RADIUS >= Table.Y_BOTTOM) {
            this.v.y *= -1;
        }
    }

    handleBallCollision(ball) {
    	const dx = ball.x - (this.x + this.v.x);
        const dy = ball.y - (this.y + this.v.y);
        const ballMidPointsDistance = Math.sqrt(dx * dx + dy * dy);
        if (ballMidPointsDistance <= 2 * Ball.RADIUS) {
            console.log("[before collision]", "this.v.length()", this.v.length(), "this.v", this.v, "ball.v", ball.v);
            this.clickAudio.currentTime = 0;
            this.clickAudio.play();

            // math is from
            // http://www.vobarian.com/collisions/2dcollisions2.pdf
            // https://www.wolframalpha.com/input/?i=elastic+collision

            // vector in the direction of the collision
            const deltaVector = new Vector(dx, dy);
            deltaVector.normalize();

            // vector orthogonal to deltaVector
            const tangentNormal = new Vector(-dy, dx);
            tangentNormal.normalize();

            // split the two vectors in 4 components:
            // each ball gets a component in deltaVector and in tangentNormal

            const thisVDelta = deltaVector.dotProduct(this.v);
            const thisVTangent = tangentNormal.dotProduct(this.v);

            const ballVDelta = deltaVector.dotProduct(ball.v);
            const ballVTangent = tangentNormal.dotProduct(ball.v);

            // the tangent part stays the same

            // calculate the new delta direction components
            // each ball pushes the other ball by exactly its velocity in the direction of the collision
            const newThisVDelta = ballVDelta;
            const newBallVDelta = thisVDelta;

            // convert the new components to x-y-Vectors
            const thisV1 = tangentNormal.copy().scale(thisVTangent);
            const thisV2 = deltaVector.copy().scale(newThisVDelta);
            this.v = thisV1.plus(thisV2);

            const ballV1 = tangentNormal.copy().scale(ballVTangent);
            const ballV2 = deltaVector.copy().scale(newBallVDelta);
            ball.v = ballV1.plus(ballV2);

            console.log("[after collision]", "this.v.length()", this.v.length(), "ball.v.length()", ball.v.length(), "this.v", this.v, "ball.v", ball.v);

            ball.isMoving = true;
            ball.moveStep();
        }
    }

    bump(theta, power) {
        this.isMoving = true;
		this.v = new Vector(-Math.cos(theta), -Math.sin(theta));
		this.v.scale(power);
		try{
			this.moveStep();
		} catch(err) {
			console.log("Ein Fehler in 'moveStep() in 'Ball.js' ist aufgetreten. " + err);
		}
		 this.game.redrawTable();
	}

    checkHoleCollision() {
    	for (const hole of Table.HOLES) {
    		const distance = Math.sqrt((this.x - hole.x)**2 + (this.y - hole.y)**2);
    		if(distance <= Table.HOLE_RADIUS) {
    			return true;
    		}
		}
    	return false;
    }

    remove() {
    	// Remove the ball if it hits/falls in a hole:
    	// Remove bedeutet, dass der Ball an eine unerreichbare Koordinate gezeichnet wird. Performance soll nicht beruecksichtigt werden.
    	const xDistance = this.game.ballsInHole;
    	this.x = (this.context.canvas.width/2 - 7*Ball.RADIUS - 90) + xDistance * 20;
		this.y = 440;
		this.v = new Vector(0,0);
	}

    kill() {
    	this.isBeingKilled = true;
    	this.isMoving = false;
    }
}

Ball.RADIUS = scaleRealCentimetersToPixel(6.15) / 2;
