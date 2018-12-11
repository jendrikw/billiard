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
        this.onStopMoving = null;
        this.holes = Table.HOLES;
        this.balls = this.game.balls;
        console.log(Table.HOLE_RADIUS);
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

    draw() {
        this.context.beginPath();
        this.context.fillStyle = this.color;
        this.context.arc(this.x, this.y, Ball.RADIUS, 0, 2 * Math.PI);
        this.context.fill();
        this.context.closePath();
    }

    moveStep() {
        console.log("moveStep", this.color);
        this.v.scale(0.99);

        this.checkBallMoving();
        this.handleCushionCollision();
		
        for (const ball of this.game.balls) {
            if (this === ball) {
                continue;
            }
            this.handleBallCollision(ball);
            
         // hole collision:
         let isInHole = this.checkHoleCollision();
         if(isInHole) {
        	 // alert("Juhuuuu! Geschafft!"); // TODO
        	 //this.ball.remove();
        	 //ball.y = 400;
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
    
    checkBallMoving() {
    	if (Math.abs(this.v.x) < 0.1 && Math.abs(this.v.y) < 0.1) {
            this.isMoving = false;
            if (this.onStopMoving != null) {
                this.onStopMoving();
            }
            return;
        }
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
    	const dx = this.x + this.v.x - ball.x;
        const dy = this.y + this.v.y - ball.y;
        const ballMidPointsDistance = Math.sqrt(dx * dx + dy * dy);
        if (ballMidPointsDistance <= 2 * Ball.RADIUS) {
            console.log(this.v, dy, dx);

            // Vector Direction firstball
            this.v = new Vector(dy, -dx);
            //this.v.setLength(3); // todo length
            
            // Vector Direction other ball
            ball.v = new Vector(-dx, -dy);
            ball.moveStep();
        }
    }
    
    bump(theta, power) {
        this.isMoving = true;
		this.v = new Vector(-Math.cos(theta), -Math.sin(theta));
		this.v.scale(power);
    	this.moveStep();
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
    		console.log(hole, distance);
    		if(distance <= Table.HOLE_RADIUS) {
    			return true;
    		}
		}
    	return false;
    }
    
    remove() {
    	// Remove the ball if it hits/falls in a hole:
    	// Remove bedeutet, dass der Ball an eine unerreichbare Koordinate gezeichnet wird. Performance soll nicht beruecksichtigt werden.
    	for (var i = 0; i < this.game.balls.length; i++) {
			if(this.ball.number == this.game.balls[i].number) {
				ball.x = 2000;
				ball.y = 2000;
			}
		}
    	
    }
}
Ball.RADIUS = scaleRealCentimetersToPixel(6.15) / 2;
