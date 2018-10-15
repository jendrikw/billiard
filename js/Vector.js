class Vector {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    normalize() {
        const len = this.length();
        this.x /= len;
        this.y /= len;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}
