'use strict';

class Vector {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    //normalises a vector
    normalize() {
        const length = this.length();
        this.x /= length;
        this.y /= length;
    }

    //returns the length of a vector
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    //scales a vector by a factor
    scale(factor) {
        this.x *= factor;
        this.y *= factor;
        return this;
    }

    //adds two vectors and returns the resulting vector
    plus(that) {
        return new Vector(this.x + that.x, this.y + that.y);
    }

    //returns the dotproduct of two vectors
    dotProduct(that) {
        return (this.x * that.x) + (this.y * that.y);
    }

    //returns a copy of an vector
    copy() {
        return new Vector(this.x, this.y);
    }
}
