'use strict';

// converts a dimension of an official pool table to pixel for the canvas
function scaleRealCentimetersToPixel(cm) {
    return cm * 2.2;
}

class Table {

    constructor() {
        this.context = getContext("table-canvas");
    }

    draw() {
        let x = (this.context.canvas.width - Table.WIDTH) / 2;
        let y = (this.context.canvas.height - Table.HEIGHT) / 2;
		var eckloch = document.getElementById('eckloch');
        var bandenloch = document.getElementById('bandenloch');
		
		this.context.beginPath();
		
		this.context.fillStyle = "green";
		this.context.fillRect(x, y, Table.WIDTH, Table.HEIGHT);
		
		this.context.drawImage(eckloch, x-22, y-20, this.context.canvas.width/4, 75);
		this.context.drawImage(bandenloch, this.context.canvas.width/4, y-20, this.context.canvas.width/4, 75);
        
		
		this.context.rotate(90*Math.PI/180);
		this.context.drawImage(bandenloch,0,0,this.context.canvas.width/4, 75); 
		
		this.context.closePath();
    }
}

Table.WIDTH = scaleRealCentimetersToPixel(270);
Table.HEIGHT = scaleRealCentimetersToPixel(270 / 2);


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
        for (let i = 0; i < 200; i += 10) {
            this.moveTo(this.x + 15, this.y + 10);
            this.draw();
        }
        this.context.closePath();
    }
}

Ball.RADIUS = scaleRealCentimetersToPixel(6.15) / 2;


class Cue {

    constructor(whiteBall) {
        this.whiteBall = whiteBall;
        this.context = getContext("cue-canvas");
        this.power = 0;
        this.mouseDown = false;
        this.increasePowerTimer = null;
        this.shootTimer = null;
        this.context.canvas.addEventListener("mousemove", e => this.onCanvasMouseMove(e));
        this.context.canvas.addEventListener("mousedown", () => this.onCanvasMouseDown());
        this.context.canvas.addEventListener("mouseup", e => this.onCanvasMouseUp(e));
        window.addEventListener("mousemove", e => this.onWindowMouseMove(e));
    }

    onCanvasMouseMove(event) {
        if (!this.mouseDown) {
            // move cue around the ball
            const mouseX = event.layerX;
            const mouseY = event.layerY;
            let theta = Math.atan((mouseY - this.whiteBall.y) / (mouseX - this.whiteBall.x));
            if (mouseX - this.whiteBall.x < 0) {
                theta += Math.PI;
            }

            this.clear();
            this.context.setTransform(1, 0, 0, 1, 0, 0);
            this.context.translate(this.whiteBall.x, this.whiteBall.y);
            this.context.rotate(theta);
            this.drawWithDistance(Cue.BALL_CUE_DISTANCE);
        }
    }

    onWindowMouseMove(event) {
        if (event.target !== this.context.canvas) {
            // mouse outside of canvas
            this.power = 0;
            this.mouseDown = false;
            if (this.increasePowerTimer) {
                clearInterval(this.increasePowerTimer);
            }
        }
    }

    onCanvasMouseDown() {
        this.mouseDown = true;
        this.power = 0;
        this.increasePowerTimer = setInterval(() => {
            this.power += 0.5;

            this.clear();
            this.drawWithDistance(this.power + Ball.RADIUS);
        }, 16)
    }

    onCanvasMouseUp(event) {
        if (this.increasePowerTimer) {
            clearInterval(this.increasePowerTimer);
        }
        this.increasePowerTimer = null;
        this.shootTimer = setInterval(() => {
            this.power -= 5;
            if (this.power < 0) {
                clearInterval(this.shootTimer);
                this.power = 0;
                this.mouseDown = false;
                // redraw because the angle might have changed
                this.onCanvasMouseMove(event);
                return;
                // todo: move ball
            }
            this.clear();
            this.drawWithDistance(this.power + Ball.RADIUS);
        }, 16);
    }

    drawWithDistance(distance) {
        this.context.drawImage(Cue.IMG, distance, -Cue.WIDTH / 2, Cue.LENGTH + Cue.BALL_CUE_DISTANCE, Cue.WIDTH);
    }

    clear() {
        this.context.save();
        // reset transformations
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        // Will always clear the right space
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context.restore();
    }

}

Cue.LENGTH = 120;
Cue.BALL_CUE_DISTANCE = 20;
Cue.IMG = null; // set in onload
Cue.WIDTH = null; // set in onload


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
    Cue.IMG = document.getElementById("cue-img");
    Cue.WIDTH = Cue.IMG.naturalHeight * (Cue.LENGTH / Cue.IMG.naturalWidth);

    let game = new Game();
    game.drawAll();
}

function getContext(id) {
    return document.getElementById(id).getContext("2d");
}
