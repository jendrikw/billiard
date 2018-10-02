'use strict';

class Kugel {
	constructor() {
		this.x = 0;
		this.y = 0;
	}
	method() {
		return '(' + this.x + ', ' + this.y + ')';
	}
	draw(ctx) {
		ctx.beginPath();
        ctx.arc(this.x, this.y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
		ctx.closePath();
	}
}

function onload() {
    let eineVariable = new Kugel();
    eineVariable.x = 100;
    eineVariable.y = 100;
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    eineVariable.draw(ctx);
}
