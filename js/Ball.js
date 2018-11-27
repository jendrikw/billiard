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
        this.x = x;
        this.y = y;
        this.v = new Vector(0, 0);
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
        console.log("moveStep", this.color);
        this.v.scale(0.99);
        if (Math.abs(this.v.x) < 0.1 && Math.abs(this.v.y) < 0.1) {
            this.isMoving = false;
            if (this.onStopMoving != null) {
                this.onStopMoving();
            }
            return;
        }
		if (this.x + this.v.x - Ball.RADIUS <= Table.X_LEFT || this.x + this.v.x + Ball.RADIUS >= Table.X_RIGHT) {
            this.v.x *= -1;
        }
        if (this.y + this.v.y - Ball.RADIUS <= Table.Y_TOP || this.y + this.v.y + Ball.RADIUS >= Table.Y_BOTTOM) {
            this.v.y *= -1;
        }
        for (const b of this.game.balls) {
            if (this === b) {
                continue;
            }
            const dx = this.x + this.v.x - b.x;
            const dy = this.y + this.v.y - b.y;
            const midPointDistance = Math.sqrt(dx * dx + dy * dy);
            if (midPointDistance <= 2 * Ball.RADIUS) {
                console.log("dx, midPointDistance", dx, midPointDistance);
                const theta = Math.acos((0.5 * dx) / (0.5 * midPointDistance));
                const angleVCollisionPoint = 0.5 * Math.PI - theta;
                console.log("theta, angleVCollisionPoint", theta, angleVCollisionPoint);

                const vLength = this.v.length() * Math.cos(theta);
                const vxChange = Math.sin(theta);
                const vyChange = Math.cos(theta);

                const otherVLength = this.v.length() * Math.sin(theta);
                const otherVxChange = Math.sin(angleVCollisionPoint);
                const otherVyChange = Math.cos(angleVCollisionPoint);

                console.log(this.v.length(), vLength, otherVLength);

                const v = this.v;
                this.v = new Vector(vxChange, vyChange);
                this.v.setLength(vLength);
                console.log(v, this.v);

                // b.v = b.v.plus(new Vector(otherVxChange, otherVyChange));
                // b.v.setLength(otherVLength);
                // console.log(b.v);

                b.moveStep();
            }
        }
    	this.x += this.v.x;
    	this.y += this.v.y;
        window.requestAnimationFrame(() => this.moveStep());
    }

    bump(theta, power) {
        this.isMoving = true;
		this.v = new Vector(-Math.cos(theta), -Math.sin(theta));
		this.v.scale(power);
    	this.moveStep();
    }
}

Ball.RADIUS = scaleRealCentimetersToPixel(6.15) / 2 * 2;
