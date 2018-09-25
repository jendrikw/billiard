'use strict';

class Kugel {
	constructor() {
		this.x = 0
		this.y = 0
	}
	method() {
		return '(' + this.x + ', ' + this.y + ')';
	}
}

var eineVariable = new Kugel();
eineVariable.x = 10;
alert(eineVariable.method());