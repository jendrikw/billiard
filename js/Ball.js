'use strict';

class Ball {

    constructor(game,x, y, number) {
    	this.game = game;
        this.context = getContext("ball-canvas");
        if (number !== undefined) {
            this.color = Ball.getColorForNumber(number);
        } else {
            this.color = "white";
        }
        this.x = x;
        this.y = y;
        this.v = null;
        this.isMoving = false;
        this.onStopMoving = null;
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
        this.v.scale(0.99);
		if (this.x - Ball.RADIUS <= Table.X_LEFT || this.x + Ball.RADIUS >= Table.X_RIGHT) {
            this.v.x *= -1;
        }
        if (this.y - Ball.RADIUS <= Table.Y_TOP || this.y + Ball.RADIUS >= Table.Y_BOTTOM) {
            this.v.y *= -1;
        }
    	this.x += this.v.x;
    	this.y += this.v.y;
    	this.game.drawBalls();
    	if (Math.abs(this.v.x) > 0.1 || Math.abs(this.v.y) > 0.1) {
    		window.requestAnimationFrame(() => this.moveStep());
    	} else {
    	    this.isMoving = false;
            if (this.onStopMoving != null) {
                this.onStopMoving();
            }
        }
    }

    bump(theta, power) {
        this.isMoving = true;
		this.v = new Vector(-Math.cos(theta), -Math.sin(theta));
		this.v.scale(power);
    	this.moveStep();
    }
}

Ball.RADIUS = scaleRealCentimetersToPixel(6.15) / 2;
