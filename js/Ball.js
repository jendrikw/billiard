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
        this.vx = 0;
        this.vy = 0;
        this.theta = null;
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
    	this.vx += Math.cos(this.theta);
		this.vy += Math.sin(this.theta);
		console.log(this.vx, this.vy);
    	this.x += this.vx;
    	this.y += this.vy;
    	this.game.drawBalls();
    	if (Math.abs(this.vx) > 1 && Math.abs(this.vy) > 1) {
    		window.requestAnimationFrame(() => this.moveStep());
    	}
    }
    
    bump(theta, power) {
    	this.theta = theta;
		this.vx = power * -Math.cos(theta);
		this.vy = power * -Math.sin(theta);
    	this.moveStep();
    }
}

Ball.RADIUS = scaleRealCentimetersToPixel(6.15) / 2;
