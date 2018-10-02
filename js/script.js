'use strict';

class Table {

    static get WIDTH() {
        return 600;
    }

    static get HEIGHT() {
        return 300;
    }

    constructor() {
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = "green";
        let x = (ctx.canvas.width - Table.WIDTH) / 2;
        let y = (ctx.canvas.height - Table.HEIGHT) / 2;
        ctx.strokeRect(x, y, Table.WIDTH, Table.HEIGHT);
        ctx.closePath();
    }
}


class Ball {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

function onload() {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    let ball1 = new Ball(100, 100, "red");
    ball1.x = 100;
    ball1.y = 100;
    ball1.draw(ctx);
    let table = new Table();
    table.draw(ctx);
}
