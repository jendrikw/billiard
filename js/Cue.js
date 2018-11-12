'use strict';

class Cue {

    constructor(whiteBall) {
        this.whiteBall = whiteBall;
        this.context = getContext("cue-canvas");
        this.canvas = this.context.canvas;
        this.power = 0;
        this.distance = 0;
        this.mouseDown = false;
        this.mouseClientX = null; // relative to the page
        this.mouseClientY = null;
        this.increaseDistanceTimer = null;
        this.shootTimer = null;
        this.theta = null;
        this.context.canvas.addEventListener("mousemove", e => this.onCanvasMouseMove(e));
        this.context.canvas.addEventListener("mousedown", () => this.onCanvasMouseDown());
        this.context.canvas.addEventListener("mouseup", () => this.onCanvasMouseUp());
        window.addEventListener("mousemove", e => this.onWindowMouseMove(e));
        whiteBall.onStopMoving = () => this.onCanvasMouseMove(new MouseEvent("move", { clientX: this.mouseClientX, clientY: this.mouseClientY }));
    }

    onCanvasMouseMove(event) {
        this.mouseClientX = event.clientX;
        this.mouseClientY = event.clientY;
        if (!this.mouseDown && !this.whiteBall.isMoving) {
            const mouseCanvasX = event.clientX - this.canvas.offsetLeft;
            const mouseCanvasY = event.clientY - this.canvas.offsetTop;
            // move cue around the ball
            this.theta = Math.atan((mouseCanvasY - this.whiteBall.y) / (mouseCanvasX - this.whiteBall.x));
            if (mouseCanvasX - this.whiteBall.x < 0) {
                this.theta += Math.PI;
            }

            this.clear();
            this.context.setTransform(1, 0, 0, 1, 0, 0);
            this.context.translate(this.whiteBall.x, this.whiteBall.y);
            this.context.rotate(this.theta);
            this.drawWithDistance(Cue.BALL_CUE_DISTANCE);
        }
    }

    onWindowMouseMove(event) {
        if (event.target !== this.context.canvas) {
            // mouse outside of canvas
            this.distance = 0;
            this.mouseDown = false;
            if (this.increaseDistanceTimer) {
                clearInterval(this.increaseDistanceTimer);
            }
        }
    }

    onCanvasMouseDown() {
        this.mouseDown = true;
        this.distance = 0;
        this.increaseDistanceTimer = setInterval(() => {
            this.distance += 0.5;

            this.clear();
            this.drawWithDistance(this.distance + Ball.RADIUS);
        }, 16)
    }

    onCanvasMouseUp() {
		let traegheit = 0.3;
        this.power = this.distance * traegheit;
        if (this.increaseDistanceTimer) {
            clearInterval(this.increaseDistanceTimer);
        }
        this.increaseDistanceTimer = null;
        this.shootTimer = setInterval(() => {
            this.distance -= 5;
            if (this.distance < 0) {
                clearInterval(this.shootTimer);
                this.distance = 0;
                this.mouseDown = false;
                // remove cue (can't touch the ball if it's moving)
                this.clear();
                // move ball
                this.whiteBall.bump(this.theta, this.power);
            } else {
                this.clear();
                this.drawWithDistance(this.distance + Ball.RADIUS);
            }
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

Cue.LENGTH = 150;
Cue.BALL_CUE_DISTANCE = 20;
Cue.IMG = null; // set in onload
Cue.WIDTH = null; // set in onload
