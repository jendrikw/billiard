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
        return this;
    }

    setLength(length) {
        this.normalize();
        // length is now 1
        this.scale(length);
        return this;
    }

    plus(that) {
        return new Vector(this.x + that.x, this.y + that.y);
    }

    minus(that) {
        return new Vector(this.x - that.x, this.y - that.y);
    }

    dotProduct(that) {
        return (this.x * that.x) + (this.y * that.y);
    }

    copy() {
        return new Vector(this.x, this.y);
    }
}
