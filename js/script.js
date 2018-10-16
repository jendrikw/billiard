'use strict';

// converts a dimension of an official pool table to pixel for the canvas
function scaleRealCmToPx(cm) {
    return cm * 2.2;
}

class Table {

    constructor() {
        this.context = getContext("table-canvas");
    }

    static get WIDTH() {
        return scaleRealCmToPx(270);
    }

    static get HEIGHT() {
        return scaleRealCmToPx(270 / 2);
    }

    draw() {
        this.context.beginPath();
        this.context.fillStyle = "green";
        let x = (this.context.canvas.width - Table.WIDTH) / 2;
        let y = (this.context.canvas.height - Table.HEIGHT) / 2;
        this.context.fillRect(x, y, Table.WIDTH, Table.HEIGHT);
        this.context.closePath();
    }
}


class Ball {

    constructor(x, y, number) {
        this.context = getContext("ball-canvas");
        if (number !== undefined) {
            this.color = Ball.getColorForNumber(number);
        } else {
            this.color = "white";
        }
        this.moveTo(x, y);
    }

    static get RADIUS() {
        return scaleRealCmToPx(6.15) / 2;
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

    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }

    draw() {
        this.context.beginPath();
        this.context.fillStyle = this.color;
        this.context.arc(this.x, this.y, Ball.RADIUS, 0, 2 * Math.PI);
        this.context.fill();
        this.context.closePath();
    }

    drawWithMoving() {
    	this.context.beginPath();
    	for(let i = 0; i<200; i+=10) {
    	    this.moveTo(this.x + 15, this.y + 10);
    		this.draw();
    	}
        this.context.closePath();
    }
}

class Cue {

    constructor(whiteBall) {
        this.whiteBall = whiteBall;
        this.context = getContext("cue-canvas");
        this.context.canvas.addEventListener("mousemove", e => this.onMouseMove(e));
        this.context.canvas.addEventListener("mousedown", e => this.onMouseDown(e));
    }

    onMouseMove(event) {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        const dx = event.offsetX - this.whiteBall.x;
        const dy = event.offsetY - this.whiteBall.y;
        const vectBallMouse = new Vector(dx, dy);
        vectBallMouse.normalize();
        const startX = this.whiteBall.x + Cue.BALL_CUE_DISTANCE * vectBallMouse.x;
        const startY = this.whiteBall.y + Cue.BALL_CUE_DISTANCE * vectBallMouse.y;
        const endX = this.whiteBall.x + (Cue.BALL_CUE_DISTANCE + Cue.LENGTH) * vectBallMouse.x;
        const endY = this.whiteBall.y + (Cue.BALL_CUE_DISTANCE + Cue.LENGTH) * vectBallMouse.y;
        this.context.beginPath();
        this.context.moveTo(startX, startY);
        this.context.lineTo(endX, endY);
        this.context.stroke();
    }

    onMouseDown(event) {
        console.log(event);
    }

    static get BALL_CUE_DISTANCE() {
        return 40;
    }

    static get LENGTH() {
        return 80;
    }

}

class Game {
    constructor() {
        this.table = new Table();
        this.balls = [];
        this.balls[0] = new Ball(300, 300);
        for (let i = 1; i <= 15; i++) {
            this.balls[i] = new Ball(100 + 20 * i, 200, i + 1);
        }
        this.cue = new Cue(this.balls[0]);
    }

   drawAll() {
       this.table.draw();
       for (let b of this.balls) {
           b.draw(b.x, b.y, b.color);
       }
   }

    drawAndMoveBalls() {
    	this.table.draw();
    	for (let b of this.balls) {
    		b.drawWithMoving();
    	}
    }
}


function onload() {
    let game = new Game();
    game.drawAll();
    //game.drawAndMoveBalls();
}

function getContext(id) {
    return document.getElementById(id).getContext("2d");
}
