'use strict';

class Ball {

    constructor(game, x, y, number) {
    	this.game = game;
        this.context = getContext("ball-canvas");
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
        this.holes = Table.HOLES;
        this.balls = this.game.balls;
        this.isInHole = false;
        this.isBeingKilled = false;
        this.fouls = 0;
        // console.log(Table.HOLE_RADIUS);
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
            this.context.arc(this.x, this.y, Ball.RADIUS * 0.4, 0, 2 * Math.PI);
            this.context.fill();
            this.context.closePath();
        }
    }

    moveStep() {
        console.log("moveStep", this.color, "x ", this.x, "y", this.y);
        this.v.scale(0.99);

        if (this.isBeingKilled || this.shouldStopMoving()) {
            return;
        }
        this.handleCushionCollision();

        for (const ball of this.game.balls) {
            if (this === ball) {
                continue;
            }
            this.handleBallCollision(ball);

         // hole collision:
         let isInHole = this.checkHoleCollision();
         if(isInHole) {
        	 if(this.color === "white") {
        		 this.x = 320;
        		 this.y = 300;
        		 this.game.incrementFouls();
        		 this.game.redrawTable();
        		 this.v = new Vector(0, 0);
                 this.isMoving = false;
        	 } else {

        		 this.remove();
        		 this.game.handleGameWon();
        	 }

         }

// let isNearToHole = this.checkNearToHole();
//
// if(!isNearToHole) {
// if (this.x + this.v.x - Ball.RADIUS <= Table.X_LEFT || this.x + this.v.x +
// Ball.RADIUS >= Table.X_RIGHT) {
// this.v.x *= -1;
// }
// if (this.y + this.v.y - Ball.RADIUS <= Table.Y_TOP || this.y + this.v.y +
// Ball.RADIUS >= Table.Y_BOTTOM) {
// this.v.y *= -1;
// }
// }
//
// this.x += this.v.x;
// this.y += this.v.y;
// this.game.drawBalls();
//
// // hole collision:
// let isInHole = this.checkHoleCollision();
// if(isInHole) {
// alert("Juhuuuu! Geschafft!");
// }
//
// if (Math.abs(this.v.x) > 0.1 || Math.abs(this.v.y) > 0.1) {
// window.requestAnimationFrame(() => this.moveStep());
// } else {
// this.isMoving = false;
// if (this.onStopMoving != null) {
// this.onStopMoving();


        }
        this.x += this.v.x;
        this.y += this.v.y;
        this.drawVelocityDirectionAndMagnitude();
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
            console.log("[before collision]", "this.v", this.v, "ball.v", ball.v);

            // Vector Direction firstball
            this.v = new Vector(dy, -dx);

            // Vector Direction other ball
            ball.v = new Vector(dx, dy);

            // Winkel berechnen zwischen colloisionVetor und this.v:
            let angle = Math.atan(dx/dy);

            // Velocity distribution:
            let distributionV = angle / (Math.PI / 2);

            ball.v.scale(4);
            this.v.scale(4);

            console.log("[after collision]", "angle", angle * 360 / (2 * Math.PI), "verteilung", distributionV, "this.v", this.v, "ball.v", ball.v);

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


    drawVelocityDirectionAndMagnitude() {
        this.context.strokeStyle = "#4169E1";
        this.context.beginPath();
        this.context.moveTo(this.x, this.y);
        this.context.lineTo(this.x + 50 * this.v.x, this.y + 50 * this.v.y);
        this.context.stroke();
	}

    checkNearToHole() {
    	for (const hole of this.holes) {
    		if(Math.sqrt((this.x - hole.x)**2 + (this.y - hole.y)**2) <= Math.SQRT2*Table.HOLE_RADIUS) {
    			return true;
    		}
		}
    	return false;
	}

    checkHoleCollision() {
    	for (const hole of this.holes) {
    		const distance = Math.sqrt((this.x - hole.x)**2 + (this.y - hole.y)**2);
    		// console.log(hole, distance);
    		if(distance <= Table.HOLE_RADIUS) {
    			return true;
    		}
		}
    	return false;
    }

    remove() {
    	// Remove the ball if it hits/falls in a hole:
    	// Remove bedeutet, dass der Ball an eine unerreichbare Koordinate gezeichnet wird. Performance soll nicht beruecksichtigt werden.
    	let xDistance = this.game.ballsInHole;
    	this.x = (this.context.canvas.width/2 - 7*Ball.RADIUS - 93) + xDistance * 20;
		this.y = 440;
		this.v = new Vector(0,0);
	}

    kill() {
    	this.isBeingKilled = true;
    }
}
Ball.RADIUS = scaleRealCentimetersToPixel(6.15) / 2;
