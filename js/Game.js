class Game {
    constructor() {
        this.table = new Table();
        this.balls = [];
        this.balls[0] = new Ball(this, 300, 300);
        for (let i = 1; i <= 15; i++) {
            this.balls[i] = new Ball(this, 100 + 20 * i, 200, i + 1);
        }
        this.cue = new Cue(this.balls[0]);
    }

    drawAll() {
        this.table.draw();
        for (let b of this.balls) {
            b.draw();
        }
    }
}
