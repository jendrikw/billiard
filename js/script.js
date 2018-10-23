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
        for (let i = 0; i < 200; i += 10) {
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
        this.power = 0;
        this.mouseDown = false;
        this.increasePowerTimer = null;
        this.vectBallMouse = null;
        this.img = document.getElementById("cue-img");
        this.context.canvas.addEventListener("mousemove", e => this.onCanvasMouseMove(e));
        this.context.canvas.addEventListener("mousedown", e => this.onCanvasMouseDown(e));
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
            const cueImgLength = this.img.naturalWidth;
            const scaleFactor = Cue.LENGTH / cueImgLength;

            this.clear();
            this.context.save();
            this.context.translate(this.whiteBall.x, this.whiteBall.y);
            this.context.rotate(theta);
            this.context.drawImage(this.img, Cue.BALL_CUE_DISTANCE, -this.img.naturalHeight * scaleFactor / 2, Cue.LENGTH + Cue.BALL_CUE_DISTANCE, this.img.naturalHeight * scaleFactor);
            this.context.restore();
        }
    }

    onWindowMouseMove(event) {
        if (event.target !== this.context.canvas) {
            this.power = 0;
            this.vectBallMouse = null;
            this.mouseDown = false;
            if (this.increasePowerTimer) {
                clearInterval(this.increasePowerTimer);
            }
        }
    }

    onCanvasMouseDown(event) {
        this.mouseDown = true;
        this.power = 0;
        const dx = event.layerX - this.whiteBall.x;
        const dy = event.layerY - this.whiteBall.y;
        this.vectBallMouse = new Vector(dx, dy);
        this.vectBallMouse.normalize();

        this.increasePowerTimer = setInterval(() => {
            this.power += 0.5;
            this.clear();
            const startX = this.whiteBall.x + (Cue.BALL_CUE_DISTANCE + this.power) * this.vectBallMouse.x;
            const startY = this.whiteBall.y + (Cue.BALL_CUE_DISTANCE + this.power) * this.vectBallMouse.y;
            const endX = this.whiteBall.x + (Cue.BALL_CUE_DISTANCE + Cue.LENGTH + this.power) * this.vectBallMouse.x;
            const endY = this.whiteBall.y + (Cue.BALL_CUE_DISTANCE + Cue.LENGTH + this.power) * this.vectBallMouse.y;
            this.context.beginPath();
            this.context.moveTo(startX, startY);
            this.context.lineTo(endX, endY);
            this.context.stroke();
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
                this.vectBallMouse = null;
                this.mouseDown = false;
                console.log(event);
                this.onCanvasMouseMove(event);
                return;
                // todo: move ball
            }
            this.clear();
            const startX = this.whiteBall.x + (this.power) * this.vectBallMouse.x;
            const startY = this.whiteBall.y + (this.power) * this.vectBallMouse.y;
            const endX = this.whiteBall.x + (Cue.LENGTH + this.power) * this.vectBallMouse.x;
            const endY = this.whiteBall.y + (Cue.LENGTH + this.power) * this.vectBallMouse.y;
            this.context.beginPath();
            this.context.moveTo(startX, startY);
            this.context.lineTo(endX, endY);
            this.context.stroke();
        }, 16);
    }

    clear() {
        // this clears the canvas
        // noinspection SillyAssignmentJS
        this.context.canvas.width = this.context.canvas.width;
    }

    static get BALL_CUE_DISTANCE() {
        return 20;
    }

    static get LENGTH() {
        return 120;
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
