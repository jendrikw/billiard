'use strict';

// converts a dimension of an official pool table to pixel for the canvas
function scaleRealCmToPx(cm) {
    return cm * 2.2;
}

class Table {

	constructor() {
    }
	
    static get WIDTH() {
        return scaleRealCmToPx(270);
    }

    static get HEIGHT() {
        return scaleRealCmToPx(270/2);
    }    

    draw(context) {
    	context.beginPath();
    	context.fillStyle = "green";
        let x = (context.canvas.width - Table.WIDTH) / 2;
        let y = (context.canvas.height - Table.HEIGHT) / 2;
        context.fillRect(x, y, Table.WIDTH, Table.HEIGHT);
        context.closePath();
    }
}


class Ball {

	constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }
	
    static get RADIUS() {
        return scaleRealCmToPx(6.15) / 2;
    }

    draw(context) {
    	context.beginPath();
    	context.arc(this.x, this.y, Ball.RADIUS, 0, 2 * Math.PI);
    	context.fillStyle = this.color;
        context.fill();
        context.closePath();
    }
    
    moveBall() {
    	let ball = new Ball(this.x + 1, this.y + 1, this.color)
    	// TODO 
    	
    }
}

class Game {
    constructor(context) {
        this.context = context;
        this.table = new Table();
        this.balls = [];
        for (let i = 0; i <= 15; i++) {
            this.balls[i] = new Ball(100 + 20 * i,  200, "red"); // Anders anzeigen (Dreieck).
        }
    }

    drawAll() {
        this.table.draw(this.context);
        for (let b of this.balls) {
            b.draw(this.context);
        }
    }
    
    move() {
    	let t = setInterval(moveBall, 1000);
    	let ball = this.balls[0]; 
    	ball.moveBall();
    }
    
}


function onload() {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");

    let game = new Game(context);
    game.drawAll();
    game.move();
}
