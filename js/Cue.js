'use strict';

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
            this.whiteBall.moveTo(this.whiteBall.x + 4, this.whiteBall.y + 4);
            this.whiteBall.draw();
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
