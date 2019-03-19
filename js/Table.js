'use strict';

class Table {

    constructor(game) {
        this.context = getContext("table-canvas");
        this.game = game;
        if (Table.X_LEFT == null) {
            // initialize variables the first time an instance is initialized
            Table.X_LEFT = (this.context.canvas.width - Table.WIDTH) / 2;
            Table.X_RIGHT = Table.X_LEFT + Table.WIDTH;
            Table.X_MIDDLE = Table.X_LEFT + Table.WIDTH / 2;

            Table.Y_TOP = (this.context.canvas.height - Table.HEIGHT) / 2;
            Table.Y_BOTTOM = Table.Y_TOP + Table.HEIGHT;
            Table.Y_MIDDLE = Table.Y_TOP + Table.HEIGHT / 2;

            Table.APEX_BALL_X = Table.X_LEFT + (1/4) * Table.WIDTH;
            Table.WHITE_BALL_X = Table.X_LEFT + (3/4) * Table.WIDTH;

            Table.HOLES = [
                new Vector(Table.X_LEFT, Table.Y_TOP),
                new Vector(Table.X_MIDDLE, Table.Y_TOP),
                new Vector(Table.X_RIGHT, Table.Y_TOP),
                new Vector(Table.X_LEFT, Table.Y_BOTTOM),
                new Vector(Table.X_MIDDLE, Table.Y_BOTTOM),
                new Vector(Table.X_RIGHT, Table.Y_BOTTOM),
            ];

            // ball storage for holed balls (background)
            Table.HOLED_BALLS_HEIGHT = Ball.RADIUS * 4;
            Table.HOLED_BALLS_WIDTH = (this.game.numberOfBalls - 1) * Table.HOLED_BALLS_HEIGHT;
            Table.HOLED_BALLS_LEFT_X = Table.X_MIDDLE - Table.HOLED_BALLS_WIDTH / 2;

            Table.HOLED_BALLS_MIDDLE_Y = Table.HOLED_BALLS_TOP_Y + Table.HOLED_BALLS_HEIGHT / 2;
            Table.HOLED_BALLS_LEFT_GRADIENT_CENTER_X = Table.HOLED_BALLS_LEFT_X + Table.HOLED_BALLS_HEIGHT / 2;
            Table.HOLED_BALLS_RIGHT_GRADIENT_CENTER_X = Table.HOLED_BALLS_LEFT_X + Table.HOLED_BALLS_WIDTH - Table.HOLED_BALLS_HEIGHT / 2;
        }
    }

    draw() {
        // draw the information texts
    	this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    	this.context.font = "22px serif";
		this.context.fillStyle = "#ffb649";
    	this.context.fillText("Fouls: " + this.game.fouls, 40, 50);
    	this.context.fillText("Eingelochte Bälle: " + this.game.ballsInHole, this.context.canvas.width / 2 - 100, 50);
    	this.context.fillText("Stöße: " + this.game.bumps, 500, 50);
    	this.context.fillText("Score: " + this.game.score, this.context.canvas.width/2 - 55, 20);

        // top
        const topGradient = this.context.createLinearGradient(0, Table.Y_TOP - Table.BORDER_WIDTH, 0, Table.Y_TOP);
        topGradient.addColorStop(0, Table.BORDER_OUTER_COLOR);
        topGradient.addColorStop(1, Table.BORDER_INNER_COLOR);
        this.context.fillStyle = topGradient;
        this.context.fillRect(Table.X_LEFT, Table.Y_TOP - Table.BORDER_WIDTH, Table.WIDTH, Table.BORDER_WIDTH + 1); // 1 for antialiasing

        // right
        const rightGradient = this.context.createLinearGradient(Table.X_RIGHT + Table.BORDER_WIDTH, 0, Table.X_RIGHT, 0);
        rightGradient.addColorStop(0, Table.BORDER_OUTER_COLOR);
        rightGradient.addColorStop(1, Table.BORDER_INNER_COLOR);
        this.context.fillStyle = rightGradient;
        this.context.fillRect(Table.X_RIGHT - 1, Table.Y_TOP, Table.BORDER_WIDTH + 1, Table.HEIGHT);

        // bottom
        const bottomGradient = this.context.createLinearGradient(0, Table.Y_BOTTOM + Table.BORDER_WIDTH, 0, Table.Y_BOTTOM);
        bottomGradient.addColorStop(0, Table.BORDER_OUTER_COLOR);
        bottomGradient.addColorStop(1, Table.BORDER_INNER_COLOR);
        this.context.fillStyle = bottomGradient;
        this.context.fillRect(Table.X_LEFT, Table.Y_BOTTOM - 1, Table.WIDTH, Table.BORDER_WIDTH + 1); // 1 for antialiasing

        // left
        const leftGradient = this.context.createLinearGradient(Table.X_LEFT - Table.BORDER_WIDTH, 0, Table.X_LEFT, 0);
        leftGradient.addColorStop(0, Table.BORDER_OUTER_COLOR);
        leftGradient.addColorStop(1, Table.BORDER_INNER_COLOR);
        this.context.fillStyle = leftGradient;
        this.context.fillRect(Table.X_LEFT - Table.BORDER_WIDTH, Table.Y_TOP, Table.BORDER_WIDTH + 1, Table.HEIGHT);

        // top left corner
        const topLeftCornerGradient = this.context.createRadialGradient(Table.X_LEFT, Table.Y_TOP, Table.BORDER_WIDTH, Table.X_LEFT, Table.Y_TOP, 0);
        topLeftCornerGradient.addColorStop(0.1, Table.BORDER_OUTER_COLOR);
        topLeftCornerGradient.addColorStop(0.9, Table.BORDER_INNER_COLOR);
        this.context.fillStyle = topLeftCornerGradient;
        this.context.moveTo(Table.X_LEFT, Table.Y_TOP + 1);
        this.context.lineTo(Table.X_LEFT - Table.BORDER_WIDTH, Table.Y_TOP + 1);
        this.context.arcTo(Table.X_LEFT - Table.BORDER_WIDTH, Table.Y_TOP - Table.BORDER_WIDTH, Table.X_LEFT + 1, Table.Y_TOP - Table.BORDER_WIDTH, Table.BORDER_WIDTH);
        this.context.lineTo(Table.X_LEFT + 1, Table.Y_TOP + 1);
        this.context.fill();

        // top right corner
        const topRightCornerGradient = this.context.createRadialGradient(Table.X_RIGHT, Table.Y_TOP, Table.BORDER_WIDTH, Table.X_RIGHT, Table.Y_TOP, 0);
        topRightCornerGradient.addColorStop(0.1, Table.BORDER_OUTER_COLOR);
        topRightCornerGradient.addColorStop(0.9, Table.BORDER_INNER_COLOR);
        this.context.fillStyle = topRightCornerGradient;
        this.context.beginPath();
        this.context.moveTo(Table.X_RIGHT, Table.Y_TOP);
        this.context.lineTo(Table.X_RIGHT + Table.BORDER_WIDTH, Table.Y_TOP + 1);
        this.context.arcTo(Table.X_RIGHT + Table.BORDER_WIDTH, Table.Y_TOP - Table.BORDER_WIDTH, Table.X_RIGHT - 100, Table.Y_TOP - Table.BORDER_WIDTH, Table.BORDER_WIDTH);
        this.context.lineTo(Table.X_RIGHT - 1, Table.Y_TOP);
        this.context.fill();

        // bottom right corner
        const bottomRightCornerGradient = this.context.createRadialGradient(Table.X_RIGHT, Table.Y_BOTTOM, Table.BORDER_WIDTH, Table.X_RIGHT, Table.Y_BOTTOM, 0);
        bottomRightCornerGradient.addColorStop(0.1, Table.BORDER_OUTER_COLOR);
        bottomRightCornerGradient.addColorStop(0.9, Table.BORDER_INNER_COLOR);
        this.context.fillStyle = bottomRightCornerGradient;
        this.context.beginPath();
        this.context.moveTo(Table.X_RIGHT - 1, Table.Y_BOTTOM - 1);
        this.context.lineTo(Table.X_RIGHT + Table.BORDER_WIDTH, Table.Y_BOTTOM - 1);
        this.context.arcTo(Table.X_RIGHT + Table.BORDER_WIDTH, Table.Y_BOTTOM + Table.BORDER_WIDTH, Table.X_RIGHT - 4, Table.Y_BOTTOM + Table.BORDER_WIDTH, Table.BORDER_WIDTH);
        this.context.lineTo(Table.X_RIGHT - 4, Table.Y_BOTTOM - 1);
        this.context.fill();

        // bottom left corner
        const bottomLeftCornerGradient = this.context.createRadialGradient(Table.X_LEFT, Table.Y_BOTTOM, Table.BORDER_WIDTH, Table.X_LEFT, Table.Y_BOTTOM, 0);
        bottomLeftCornerGradient.addColorStop(0.1, Table.BORDER_OUTER_COLOR);
        bottomLeftCornerGradient.addColorStop(0.9, Table.BORDER_INNER_COLOR);
        this.context.fillStyle = bottomLeftCornerGradient;
        this.context.beginPath();
        this.context.moveTo(Table.X_LEFT + 1, Table.Y_BOTTOM - 1);
        this.context.lineTo(Table.X_LEFT - Table.BORDER_WIDTH, Table.Y_BOTTOM - 1);
        this.context.arcTo(Table.X_LEFT - Table.BORDER_WIDTH, Table.Y_BOTTOM + Table.BORDER_WIDTH, Table.X_LEFT + 2, Table.Y_BOTTOM + Table.BORDER_WIDTH, Table.BORDER_WIDTH);
        this.context.lineTo(Table.X_LEFT + 2, Table.Y_BOTTOM - 1);
        this.context.fill();

        // table
        this.context.beginPath();
        this.context.fillStyle = Table.COLOR;
        this.context.fillRect(Table.X_LEFT, Table.Y_TOP, Table.WIDTH, Table.HEIGHT);

        // top left hole
        this.context.strokeStyle = Table.COLOR;
        this.context.lineCap = "round";
        this.context.lineWidth = 1.95 * Table.HOLE_RADIUS;
        this.context.beginPath();
        this.context.moveTo(Table.X_LEFT, Table.Y_TOP);
        this.context.lineTo(Table.X_LEFT, Table.Y_TOP);
        this.context.stroke();

        this.context.fillStyle = "black";
        this.context.beginPath();
        this.context.arc(Table.X_LEFT, Table.Y_TOP, Table.HOLE_RADIUS, 0, 2 * Math.PI);
        this.context.fill();

        // top middle hole
        this.context.strokeStyle = Table.COLOR;
        this.context.lineCap = "round";
        this.context.lineJoin = "round";
        this.context.lineWidth = 1.9 * Table.HOLE_RADIUS;
        this.context.beginPath();
        this.context.moveTo(Table.X_MIDDLE - 0.3 * Table.HOLE_RADIUS, Table.Y_TOP);
        this.context.lineTo(Table.X_MIDDLE, Table.Y_TOP - Table.HOLE_RADIUS);
        this.context.lineTo(Table.X_MIDDLE + 0.3 * Table.HOLE_RADIUS, Table.Y_TOP);
        this.context.stroke();

        this.context.fillStyle = "black";
        this.context.beginPath();
        this.context.arc(Table.X_MIDDLE, Table.Y_TOP - Table.HOLE_RADIUS, Table.HOLE_RADIUS, 0, 2 * Math.PI);
        this.context.fill();

        // top right hole
        this.context.strokeStyle = Table.COLOR;
        this.context.lineCap = "round";
        this.context.lineWidth = 1.9 * Table.HOLE_RADIUS;
        this.context.beginPath();
        this.context.moveTo(Table.X_RIGHT, Table.Y_TOP);
        this.context.lineTo(Table.X_RIGHT, Table.Y_TOP);
        this.context.stroke();

        this.context.fillStyle = "black";
        this.context.beginPath();
        this.context.arc(Table.X_RIGHT, Table.Y_TOP, Table.HOLE_RADIUS, 0, 2 * Math.PI);
        this.context.fill();

        // bottom right hole
        this.context.strokeStyle = Table.COLOR;
        this.context.lineCap = "round";
        this.context.lineWidth = 1.9 * Table.HOLE_RADIUS;
        this.context.beginPath();
        this.context.moveTo(Table.X_RIGHT, Table.Y_BOTTOM);
        this.context.lineTo(Table.X_RIGHT, Table.Y_BOTTOM);
        this.context.stroke();

        this.context.fillStyle = "black";
        this.context.beginPath();
        this.context.arc(Table.X_RIGHT, Table.Y_BOTTOM, Table.HOLE_RADIUS, 0, 2 * Math.PI);
        this.context.fill();

        // bottom middle hole
        this.context.strokeStyle = Table.COLOR;
        this.context.lineCap = "round";
        this.context.lineJoin = "round";
        this.context.lineWidth = 1.9 * Table.HOLE_RADIUS;
        this.context.beginPath();
        this.context.moveTo(Table.X_MIDDLE - 0.3 * Table.HOLE_RADIUS, Table.Y_BOTTOM);
        this.context.lineTo(Table.X_MIDDLE, Table.Y_BOTTOM + Table.HOLE_RADIUS);
        this.context.lineTo(Table.X_MIDDLE + 0.3 * Table.HOLE_RADIUS, Table.Y_BOTTOM);
        this.context.stroke();

        this.context.fillStyle = "black";
        this.context.beginPath();
        this.context.arc(Table.X_MIDDLE, Table.Y_BOTTOM + Table.HOLE_RADIUS, Table.HOLE_RADIUS, 0, 2 * Math.PI);
        this.context.fill();

        // bottom left hole
        this.context.strokeStyle = Table.COLOR;
        this.context.lineCap = "round";
        this.context.lineWidth = 1.9 * Table.HOLE_RADIUS;
        this.context.beginPath();
        this.context.moveTo(Table.X_LEFT, Table.Y_BOTTOM);
        this.context.lineTo(Table.X_LEFT, Table.Y_BOTTOM);
        this.context.stroke();

        this.context.fillStyle = "black";
        this.context.beginPath();
        this.context.arc(Table.X_LEFT, Table.Y_BOTTOM, Table.HOLE_RADIUS, 0, 2 * Math.PI);
        this.context.fill();

        // draw line for white ball
        this.context.fillStyle = "#AAAAAA80";
        this.context.beginPath();
        this.context.arc(Table.WHITE_BALL_X, Table.Y_MIDDLE, 2, 0, 2 * Math.PI);
        this.context.fill();

        // draw white dot for apex ball
        this.context.fillStyle = "#AAAAAA80";
        this.context.beginPath();
        this.context.arc(Table.APEX_BALL_X, Table.Y_MIDDLE, 2, 0, 2 * Math.PI);
        this.context.fill();

        // draw are for ball that have been holed
        const holedAreaGradient = this.context.createLinearGradient(0, Table.HOLED_BALLS_TOP_Y, 0, Table.HOLED_BALLS_TOP_Y + Table.HOLED_BALLS_HEIGHT);
        holedAreaGradient.addColorStop(0, Table.BORDER_INNER_COLOR);
        holedAreaGradient.addColorStop(0.5, Table.BORDER_HOLED_BALL_INNER_COLOR);
        holedAreaGradient.addColorStop(1, Table.BORDER_INNER_COLOR);
        this.context.fillStyle = holedAreaGradient;
        this.context.fillRect(Table.HOLED_BALLS_LEFT_GRADIENT_CENTER_X, Table.HOLED_BALLS_TOP_Y, Table.HOLED_BALLS_WIDTH - Table.HOLED_BALLS_HEIGHT, Table.HOLED_BALLS_HEIGHT);

        const holedAreaLeftGradient = this.context.createRadialGradient(Table.HOLED_BALLS_LEFT_GRADIENT_CENTER_X, Table.HOLED_BALLS_MIDDLE_Y, Table.HOLED_BALLS_HEIGHT / 2, Table.HOLED_BALLS_LEFT_GRADIENT_CENTER_X, Table.HOLED_BALLS_MIDDLE_Y, 0);
        holedAreaLeftGradient.addColorStop(0.1, Table.BORDER_INNER_COLOR);
        holedAreaLeftGradient.addColorStop(1, Table.BORDER_HOLED_BALL_INNER_COLOR);
        this.context.fillStyle = holedAreaLeftGradient;
        this.context.moveTo(Table.HOLED_BALLS_LEFT_GRADIENT_CENTER_X, Table.HOLED_BALLS_MIDDLE_Y);
        this.context.lineTo(Table.HOLED_BALLS_LEFT_GRADIENT_CENTER_X, Table.HOLED_BALLS_TOP_Y + Table.HOLED_BALLS_HEIGHT / 2);
        this.context.arc(Table.HOLED_BALLS_LEFT_GRADIENT_CENTER_X, Table.HOLED_BALLS_MIDDLE_Y, Table.HOLED_BALLS_HEIGHT / 2, 0.5 * Math.PI, 1.5 * Math.PI);
        this.context.lineTo(Table.HOLED_BALLS_LEFT_GRADIENT_CENTER_X, Table.HOLED_BALLS_MIDDLE_Y);
        this.context.fill();

        const holedAreaRightGradient = this.context.createRadialGradient(Table.HOLED_BALLS_RIGHT_GRADIENT_CENTER_X, Table.HOLED_BALLS_MIDDLE_Y, Table.HOLED_BALLS_HEIGHT / 2, Table.HOLED_BALLS_RIGHT_GRADIENT_CENTER_X, Table.HOLED_BALLS_MIDDLE_Y, 0);
        holedAreaRightGradient.addColorStop(0.1, Table.BORDER_INNER_COLOR);
        holedAreaRightGradient.addColorStop(1, Table.BORDER_HOLED_BALL_INNER_COLOR);
        this.context.fillStyle = holedAreaRightGradient;
        this.context.moveTo(Table.HOLED_BALLS_RIGHT_GRADIENT_CENTER_X, Table.HOLED_BALLS_MIDDLE_Y);
        this.context.lineTo(Table.HOLED_BALLS_RIGHT_GRADIENT_CENTER_X, Table.HOLED_BALLS_TOP_Y);
        this.context.arc(Table.HOLED_BALLS_RIGHT_GRADIENT_CENTER_X, Table.HOLED_BALLS_MIDDLE_Y, Table.HOLED_BALLS_HEIGHT / 2, 1.5 * Math.PI, 2.5 * Math.PI);
        this.context.lineTo(Table.HOLED_BALLS_RIGHT_GRADIENT_CENTER_X, Table.HOLED_BALLS_MIDDLE_Y);
        this.context.fill();
    }
}

// a table is 270cm long at the longer side, and half of that on the smaller side
Table.WIDTH = scaleRealCentimetersToPixel(270);
Table.HEIGHT = scaleRealCentimetersToPixel(270 / 2);
Table.COLOR = "green";
Table.BORDER_OUTER_COLOR = "#432918";
Table.BORDER_INNER_COLOR = "#7d4e24";
Table.BORDER_HOLED_BALL_INNER_COLOR = "#4F301C";
Table.BORDER_WIDTH = 29;
Table.HOLE_RADIUS = 1.9 * Ball.RADIUS; // this factor was found by some testing
// set in constructor, because they are dependant on the canvas
Table.X_LEFT = null;
Table.X_MIDDLE = null;
Table.X_RIGHT = null;
Table.Y_TOP = null;
Table.Y_BOTTOM = null;
Table.HOLES = null;


Table.HOLED_BALLS_MIDDLE_Y = null;
Table.HOLED_BALLS_LEFT_X = null;
Table.HOLED_BALLS_TOP_Y = 440;
Table.HOLED_BALLS_WIDTH = null;
Table.HOLED_BALLS_HEIGHT = null;
Table.HOLED_BALLS_LEFT_GRADIENT_CENTER_X = null;
Table.HOLED_BALLS_RIGHT_GRADIENT_CENTER_X = null;
