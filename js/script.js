'use strict';

// converts a dimension of an official pool table to pixel for the canvas
function scaleRealCmToPx(cm) {
    return cm * 2.2;
}

class Table {

    static get WIDTH() {
        return scaleRealCmToPx(270);
    }

    static get HEIGHT() {
        return scaleRealCmToPx(270/2);
    }

    constructor() {
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = "green";
        let x = (ctx.canvas.width - Table.WIDTH) / 2;
        let y = (ctx.canvas.height - Table.HEIGHT) / 2;
        ctx.fillRect(x, y, Table.WIDTH, Table.HEIGHT);
        ctx.closePath();
    }
}


class Ball {

    static get RADIUS() {
        return scaleRealCmToPx(6.15) / 2;
    }

    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, Ball.RADIUS, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    contains(x, y) {
        let dx = x - this.x;
        let dy = y - this.y;
        return Math.sqrt(dx * dx + dy * dy) <= Ball.RADIUS;
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Game {
    constructor(ctx) {
        this.ctx = ctx;
        this.table = new Table();
        this.balls = [];
        for (let i = 0; i <= 15; i++) {
            this.balls[i] = new Ball(100 + 20 * i,  200, "red");
        }
    }

    drawAll() {
        this.table.draw(this.ctx);
        for (let b of this.balls) {
            b.draw(this.ctx);
        }
    }

}

function onload() {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    let game = new Game(ctx);
    game.drawAll();

}
