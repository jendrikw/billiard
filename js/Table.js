'use strict';

class Table {

    constructor() {
        this.context = getContext("table-canvas");
        if (Table.X_LEFT == null) {
            Table.X_LEFT = (this.context.canvas.width - Table.WIDTH) / 2;
            Table.X_RIGHT = Table.X_LEFT + Table.WIDTH;
            Table.Y_TOP = (this.context.canvas.height - Table.HEIGHT) / 2;
            Table.Y_BOTTOM = Table.Y_TOP + Table.HEIGHT;
        }
    }

    draw() {
        const xMiddle = Table.X_LEFT + Table.WIDTH / 2;
        const holeRadius = 1.5 * Ball.RADIUS;
        const holeOffset = Math.sqrt(holeRadius);

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
        this.context.fillRect(Table.X_RIGHT, Table.Y_TOP, Table.BORDER_WIDTH, Table.HEIGHT);

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
        this.context.fillRect(Table.X_LEFT - Table.BORDER_WIDTH, Table.Y_TOP, Table.BORDER_WIDTH, Table.HEIGHT);

        // top left corner
        const topLeftCornerGradient = this.context.createRadialGradient(Table.X_LEFT, Table.Y_TOP, Table.BORDER_WIDTH, Table.X_LEFT, Table.Y_TOP, 0);
        topLeftCornerGradient.addColorStop(0.1, Table.BORDER_OUTER_COLOR);
        topLeftCornerGradient.addColorStop(0.9, Table.BORDER_INNER_COLOR);
        this.context.fillStyle = topLeftCornerGradient;
        this.context.moveTo(Table.X_LEFT, Table.Y_TOP + 1);
        this.context.lineTo(Table.X_LEFT - Table.BORDER_WIDTH, Table.Y_TOP + 1);
        this.context.arcTo(Table.X_LEFT - Table.BORDER_WIDTH, Table.Y_TOP - Table.BORDER_WIDTH, Table.X_LEFT, Table.Y_TOP - Table.BORDER_WIDTH, Table.BORDER_WIDTH);
        this.context.lineTo(Table.X_LEFT, Table.Y_TOP);
        this.context.fill();

        // top right corner
        const topRightCornerGradient = this.context.createRadialGradient(Table.X_RIGHT, Table.Y_TOP, Table.BORDER_WIDTH, Table.X_RIGHT, Table.Y_TOP, 0);
        topRightCornerGradient.addColorStop(0.1, Table.BORDER_OUTER_COLOR);
        topRightCornerGradient.addColorStop(0.9, Table.BORDER_INNER_COLOR);
        this.context.fillStyle = topRightCornerGradient;
        this.context.beginPath();
        this.context.moveTo(Table.X_RIGHT, Table.Y_TOP + 1);
        this.context.lineTo(Table.X_RIGHT + Table.BORDER_WIDTH, Table.Y_TOP + 1);
        this.context.arcTo(Table.X_RIGHT + Table.BORDER_WIDTH, Table.Y_TOP - Table.BORDER_WIDTH, Table.X_RIGHT, Table.Y_TOP - Table.BORDER_WIDTH, Table.BORDER_WIDTH);
        this.context.lineTo(Table.X_RIGHT, Table.Y_TOP);
        this.context.fill();

        // bottom right corner
        const bottomRightCornerGradient = this.context.createRadialGradient(Table.X_RIGHT, Table.Y_BOTTOM, Table.BORDER_WIDTH, Table.X_RIGHT, Table.Y_BOTTOM, 0);
        bottomRightCornerGradient.addColorStop(0.1, Table.BORDER_OUTER_COLOR);
        bottomRightCornerGradient.addColorStop(0.9, Table.BORDER_INNER_COLOR);
        this.context.fillStyle = bottomRightCornerGradient;
        this.context.beginPath();
        this.context.moveTo(Table.X_RIGHT, Table.Y_BOTTOM - 1);
        this.context.lineTo(Table.X_RIGHT + Table.BORDER_WIDTH, Table.Y_BOTTOM - 1);
        this.context.arcTo(Table.X_RIGHT + Table.BORDER_WIDTH, Table.Y_BOTTOM + Table.BORDER_WIDTH, Table.X_RIGHT, Table.Y_BOTTOM + Table.BORDER_WIDTH, Table.BORDER_WIDTH);
        this.context.lineTo(Table.X_RIGHT, Table.Y_BOTTOM - 1);
        this.context.fill();

        // bottom left corner
        const bottomLeftCornerGradient = this.context.createRadialGradient(Table.X_LEFT, Table.Y_BOTTOM, Table.BORDER_WIDTH, Table.X_LEFT, Table.Y_BOTTOM, 0);
        bottomLeftCornerGradient.addColorStop(0.1, Table.BORDER_OUTER_COLOR);
        bottomLeftCornerGradient.addColorStop(0.9, Table.BORDER_INNER_COLOR);
        this.context.fillStyle = bottomLeftCornerGradient;
        this.context.beginPath();
        this.context.moveTo(Table.X_LEFT, Table.Y_BOTTOM - 1);
        this.context.lineTo(Table.X_LEFT - Table.BORDER_WIDTH, Table.Y_BOTTOM - 1);
        this.context.arcTo(Table.X_LEFT - Table.BORDER_WIDTH, Table.Y_BOTTOM + Table.BORDER_WIDTH, Table.X_LEFT, Table.Y_BOTTOM + Table.BORDER_WIDTH, Table.BORDER_WIDTH);
        this.context.lineTo(Table.X_LEFT, Table.Y_BOTTOM - 1);
        this.context.fill();

        // table
        this.context.beginPath();
        this.context.fillStyle = Table.COLOR;
        this.context.fillRect(Table.X_LEFT, Table.Y_TOP, Table.WIDTH, Table.HEIGHT);

        // top left hole
        this.context.strokeStyle = Table.COLOR;
        this.context.lineCap = "round";
        this.context.lineWidth = 1.95 * holeRadius;
        this.context.beginPath();
        this.context.moveTo(Table.X_LEFT + holeOffset, Table.Y_TOP + holeOffset);
        this.context.lineTo(Table.X_LEFT - holeOffset, Table.Y_TOP - holeOffset);
        this.context.stroke();

        this.context.fillStyle = "black";
        this.context.beginPath();
        this.context.arc(Table.X_LEFT - holeOffset, Table.Y_TOP - holeOffset, holeRadius, 0, 2 * Math.PI);
        this.context.fill();

        // top middle hole
        this.context.strokeStyle = Table.COLOR;
        this.context.lineCap = "round";
        this.context.lineJoin = "round";
        this.context.lineWidth = 1.9 * holeRadius;
        this.context.beginPath();
        this.context.moveTo(xMiddle - 0.3 * holeRadius, Table.Y_TOP);
        this.context.lineTo(xMiddle, Table.Y_TOP - holeRadius);
        this.context.lineTo(xMiddle + 0.3 * holeRadius, Table.Y_TOP);
        this.context.stroke();

        this.context.fillStyle = "black";
        this.context.beginPath();
        this.context.arc(xMiddle, Table.Y_TOP - holeRadius, holeRadius, 0, 2 * Math.PI);
        this.context.fill();

        // top right hole
        this.context.strokeStyle = Table.COLOR;
        this.context.lineCap = "round";
        this.context.lineWidth = 1.9 * holeRadius;
        this.context.beginPath();
        this.context.moveTo(Table.X_RIGHT - holeOffset, Table.Y_TOP + holeOffset);
        this.context.lineTo(Table.X_RIGHT + holeOffset, Table.Y_TOP - holeOffset);
        this.context.stroke();

        this.context.fillStyle = "black";
        this.context.beginPath();
        this.context.arc(Table.X_RIGHT + holeOffset, Table.Y_TOP - holeOffset, holeRadius, 0, 2 * Math.PI);
        this.context.fill();

        // bottom right hole
        this.context.strokeStyle = Table.COLOR;
        this.context.lineCap = "round";
        this.context.lineWidth = 1.9 * holeRadius;
        this.context.beginPath();
        this.context.moveTo(Table.X_RIGHT - holeOffset, Table.Y_BOTTOM - holeOffset);
        this.context.lineTo(Table.X_RIGHT + holeOffset, Table.Y_BOTTOM + holeOffset);
        this.context.stroke();

        this.context.fillStyle = "black";
        this.context.beginPath();
        this.context.arc(Table.X_RIGHT + holeOffset, Table.Y_BOTTOM + holeOffset, holeRadius, 0, 2 * Math.PI);
        this.context.fill();

        // bottom middle hole
        this.context.strokeStyle = Table.COLOR;
        this.context.lineCap = "round";
        this.context.lineJoin = "round";
        this.context.lineWidth = 1.9 * holeRadius;
        this.context.beginPath();
        this.context.moveTo(xMiddle - 0.3 * holeRadius, Table.Y_BOTTOM);
        this.context.lineTo(xMiddle, Table.Y_BOTTOM + holeRadius);
        this.context.lineTo(xMiddle + 0.3 * holeRadius, Table.Y_BOTTOM);
        this.context.stroke();

        this.context.fillStyle = "black";
        this.context.beginPath();
        this.context.arc(xMiddle, Table.Y_BOTTOM + holeRadius, holeRadius, 0, 2 * Math.PI);
        this.context.fill();

        // bottom left hole
        this.context.strokeStyle = Table.COLOR;
        this.context.lineCap = "round";
        this.context.lineWidth = 1.9 * holeRadius;
        this.context.beginPath();
        this.context.moveTo(Table.X_LEFT + holeOffset, Table.Y_BOTTOM - holeOffset);
        this.context.lineTo(Table.X_LEFT - holeOffset, Table.Y_BOTTOM + holeOffset);
        this.context.stroke();

        this.context.fillStyle = "black";
        this.context.beginPath();
        this.context.arc(Table.X_LEFT - holeOffset, Table.Y_BOTTOM + holeOffset, holeRadius, 0, 2 * Math.PI);
        this.context.fill();
    }
}

Table.WIDTH = scaleRealCentimetersToPixel(270);
Table.HEIGHT = scaleRealCentimetersToPixel(270 / 2);
Table.COLOR = "green";
Table.BORDER_OUTER_COLOR = "#432918";
Table.BORDER_INNER_COLOR = "#7d4e24";
Table.BORDER_WIDTH = 25;
Table.X_LEFT = null; // set in constructor
Table.X_RIGHT = null;
Table.Y_TOP = null;
Table.Y_BOTTOM = null;
