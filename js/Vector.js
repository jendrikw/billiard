'use strict';

class Vector {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    normalize() {
        const length = this.length();
        this.x /= length;
        this.y /= length;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    scale(factor) {
        this.x *= factor;
        this.y *= factor;
    }

    setLength(l) {
        this.normalize();
        // length is now 1
        this.scale(l);
    }

    plus(that) {
        return new Vector(this.x + that.x, this.y + that.y);
    }

    minus(that) {
        return new Vector(this.x - that.x, this.y - that.y);
    }
}
