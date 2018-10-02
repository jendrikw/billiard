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
        ctx.arc(this.x, this.y, scaleRealCmToPx(6.15)/2, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

function onload() {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    let ball1 = new Ball(200, 200, "red");
    ball1.draw(ctx);
    let table = new Table();
    table.draw(ctx);
}
