'use strict';

class Cue {

    constructor(game, whiteBall) {
        this.game = game;
        this.whiteBall = whiteBall;
        this.context = getContext("cue-canvas");
        this.canvas = this.context.canvas;
        this.power = 0;
        this.distance = 0;
        this.mouseDown = false;
        this.mouseClientX = null; // relative to the page
        this.mouseClientY = null;
        this.theta = null;
        this.bumpCounter = 0;
        this.context.canvas.addEventListener("mousemove", this.internalMouseMove = e => this.onCanvasMouseMove(e));
        this.context.canvas.addEventListener("mousedown", this.internalMouseDown = () => this.onCanvasMouseDown());
        this.context.canvas.addEventListener("mouseup", this.internalMouseUp = () => this.onCanvasMouseUp());
        window.addEventListener("mousemove", this.internalWindowMouseMove = e => this.onWindowMouseMove(e));
    }

    onCanvasMouseMove(event) {
        this.mouseClientX = event.clientX;
        this.mouseClientY = event.clientY;
        if (!this.mouseDown && !this.power && this.allowedToShoot()) {
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
        }
    }

    onCanvasMouseDown() {
        if (!this.allowedToShoot()) {
            return;
        }
        this.mouseDown = true;
        this.distance = 0;
        this.increaseDistance();
    }

    increaseDistance() {
        this.distance += 0.5;
        this.clear();
        this.drawWithDistance(this.distance + Ball.RADIUS);
        if (this.mouseDown) {
            window.requestAnimationFrame(() => this.increaseDistance());
        } else {
            this.clear();
        }
    }

    onCanvasMouseUp() {
        if (!this.allowedToShoot()) {
            return;
        }
        this.mouseDown = false;
        this.power = Math.min(this.distance * Cue.CUE_POWER_TO_BALL_SPEED_FACTOR, 1.5 * Math.sqrt(this.distance));
        this.shoot();
    }

    shoot() {
        this.distance -= 5;
        if (this.distance < 0) {
            this.distance = 0;
            this.mouseDown = false;
            // remove cue (can't touch the ball if it's moving)
            this.clear();
            // increment bumpCounter for the score:
            this.game.incrementBumps();
            // move ball
            this.whiteBall.bump(this.theta, this.power);
            this.power = null;
        } else {
            this.clear();
            this.drawWithDistance(this.distance + Ball.RADIUS);
            window.requestAnimationFrame(() => this.shoot());
        }
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

    allowedToShoot() {
        const b = !this.game.areAnyBallsMoving() && !this.game.isPaused;
        console.log("allowedToShoot", b);
        return b;
    }

    kill() {
    	delete this.game;
    	delete this.canvas;
    	this.context.canvas.removeEventListener("mousemove", this.internalMouseMove);
    	this.context.canvas.removeEventListener("mousedown", this.internalMouseDown);
    	this.context.canvas.removeEventListener("mouseup", this.internalMouseUp);
    	this.context.canvas.removeEventListener("mousemove", this.internalWindowMouseMove);
    }

}

Cue.LENGTH = 150;
Cue.BALL_CUE_DISTANCE = 20;
Cue.IMG = null; // set in onload
Cue.WIDTH = null; // set in onload
Cue.CUE_POWER_TO_BALL_SPEED_FACTOR = 0.3;
