class Table {

    constructor() {
        this.context = getContext("table-canvas");
    }

    draw() {
        const xLeft = (this.context.canvas.width - Table.WIDTH) / 2;
        const xMiddle = xLeft + Table.WIDTH / 2;
        const xRight = xLeft + Table.WIDTH;

        const yTop = (this.context.canvas.height - Table.HEIGHT) / 2;
        const yBottom = yTop + Table.HEIGHT;
        const holeRadius = 1.2 * Ball.RADIUS;
        const holeOffset = Math.sqrt(holeRadius);

        // top
        const topGradient = this.context.createLinearGradient(0, yTop - Table.BORDER_WIDTH, 0, yTop);
        topGradient.addColorStop(0, Table.BORDER_OUTER_COLOR);
        topGradient.addColorStop(1, Table.BORDER_INNER_COLOR);
        this.context.fillStyle = topGradient;
        this.context.fillRect(xLeft, yTop - Table.BORDER_WIDTH, Table.WIDTH, Table.BORDER_WIDTH + 1); // 1 for antialiasing

        // right
        const rightGradient = this.context.createLinearGradient(xRight + Table.BORDER_WIDTH, 0, xRight, 0);
        rightGradient.addColorStop(0, Table.BORDER_OUTER_COLOR);
        rightGradient.addColorStop(1, Table.BORDER_INNER_COLOR);
        this.context.fillStyle = rightGradient;
        this.context.fillRect(xRight, yTop, Table.BORDER_WIDTH, Table.HEIGHT);

        // bottom
        const bottomGradient = this.context.createLinearGradient(0, yBottom + Table.BORDER_WIDTH, 0, yBottom);
        bottomGradient.addColorStop(0, Table.BORDER_OUTER_COLOR);
        bottomGradient.addColorStop(1, Table.BORDER_INNER_COLOR);
        this.context.fillStyle = bottomGradient;
        this.context.fillRect(xLeft, yBottom - 1, Table.WIDTH, Table.BORDER_WIDTH + 1); // 1 for antialiasing

        // left
        const leftGradient = this.context.createLinearGradient(xLeft - Table.BORDER_WIDTH, 0, xLeft, 0);
        leftGradient.addColorStop(0, Table.BORDER_OUTER_COLOR);
        leftGradient.addColorStop(1, Table.BORDER_INNER_COLOR);
        this.context.fillStyle = leftGradient;
        this.context.fillRect(xLeft - Table.BORDER_WIDTH, yTop, Table.BORDER_WIDTH, Table.HEIGHT);

        // top left corner
        const topLeftCornerGradient = this.context.createRadialGradient(xLeft, yTop, Table.BORDER_WIDTH, xLeft, yTop, 0);
        topLeftCornerGradient.addColorStop(0.1, Table.BORDER_OUTER_COLOR);
        topLeftCornerGradient.addColorStop(0.9, Table.BORDER_INNER_COLOR);
        this.context.fillStyle = topLeftCornerGradient;
        this.context.moveTo(xLeft, yTop + 1);
        this.context.lineTo(xLeft - Table.BORDER_WIDTH, yTop + 1);
        this.context.arcTo(xLeft - Table.BORDER_WIDTH, yTop - Table.BORDER_WIDTH, xLeft, yTop - Table.BORDER_WIDTH, Table.BORDER_WIDTH);
        this.context.lineTo(xLeft, yTop);
        this.context.fill();

        // top right corner
        const topRightCornerGradient = this.context.createRadialGradient(xRight, yTop, Table.BORDER_WIDTH, xRight, yTop, 0);
        topRightCornerGradient.addColorStop(0.1, Table.BORDER_OUTER_COLOR);
        topRightCornerGradient.addColorStop(0.9, Table.BORDER_INNER_COLOR);
        this.context.fillStyle = topRightCornerGradient;
        this.context.beginPath();
        this.context.moveTo(xRight, yTop + 1);
        this.context.lineTo(xRight + Table.BORDER_WIDTH, yTop + 1);
        this.context.arcTo(xRight + Table.BORDER_WIDTH, yTop - Table.BORDER_WIDTH, xRight, yTop - Table.BORDER_WIDTH, Table.BORDER_WIDTH);
        this.context.lineTo(xRight, yTop);
        this.context.fill();

        // bottom right corner
        const bottomRightCornerGradient = this.context.createRadialGradient(xRight, yBottom, Table.BORDER_WIDTH, xRight, yBottom, 0);
        bottomRightCornerGradient.addColorStop(0.1, Table.BORDER_OUTER_COLOR);
        bottomRightCornerGradient.addColorStop(0.9, Table.BORDER_INNER_COLOR);
        this.context.fillStyle = bottomRightCornerGradient;
        this.context.beginPath();
        this.context.moveTo(xRight, yBottom - 1);
        this.context.lineTo(xRight + Table.BORDER_WIDTH, yBottom - 1);
        this.context.arcTo(xRight + Table.BORDER_WIDTH, yBottom + Table.BORDER_WIDTH, xRight, yBottom + Table.BORDER_WIDTH, Table.BORDER_WIDTH);
        this.context.lineTo(xRight, yBottom - 1);
        this.context.fill();

        // bottom left corner
        const bottomLeftCornerGradient = this.context.createRadialGradient(xLeft, yBottom, Table.BORDER_WIDTH, xLeft, yBottom, 0);
        bottomLeftCornerGradient.addColorStop(0.1, Table.BORDER_OUTER_COLOR);
        bottomLeftCornerGradient.addColorStop(0.9, Table.BORDER_INNER_COLOR);
        this.context.fillStyle = bottomLeftCornerGradient;
        this.context.beginPath();
        this.context.moveTo(xLeft, yBottom - 1);
        this.context.lineTo(xLeft - Table.BORDER_WIDTH, yBottom - 1);
        this.context.arcTo(xLeft - Table.BORDER_WIDTH, yBottom + Table.BORDER_WIDTH, xLeft, yBottom + Table.BORDER_WIDTH, Table.BORDER_WIDTH);
        this.context.lineTo(xLeft, yBottom - 1);
        this.context.fill();

        // table
        this.context.beginPath();
        this.context.fillStyle = Table.COLOR;
        this.context.fillRect(xLeft, yTop, Table.WIDTH, Table.HEIGHT);

        // top left hole
        this.context.strokeStyle = Table.COLOR;
        this.context.lineCap = "round";
        this.context.lineWidth = 1.9 * holeRadius;
        this.context.beginPath();
        this.context.moveTo(xLeft + holeOffset, yTop + holeOffset);
        this.context.lineTo(xLeft - holeOffset, yTop - holeOffset);
        this.context.stroke();

        this.context.fillStyle = "black";
        this.context.beginPath();
        this.context.arc(xLeft - holeOffset, yTop - holeOffset, holeRadius, 0, 2 * Math.PI);
        this.context.fill();

        // top middle hole
        this.context.strokeStyle = Table.COLOR;
        this.context.lineCap = "round";
        this.context.lineWidth = 1.9 * holeRadius;
        this.context.beginPath();
        this.context.moveTo(xMiddle, yTop);
        this.context.lineTo(xMiddle, yTop - holeRadius);
        this.context.stroke();

        this.context.fillStyle = "black";
        this.context.beginPath();
        this.context.arc(xMiddle, yTop - holeRadius, holeRadius, 0, 2 * Math.PI);
        this.context.fill();

        // top right hole
        this.context.strokeStyle = Table.COLOR;
        this.context.lineCap = "round";
        this.context.lineWidth = 1.9 * holeRadius;
        this.context.beginPath();
        this.context.moveTo(xRight - holeOffset, yTop + holeOffset);
        this.context.lineTo(xRight + holeOffset, yTop - holeOffset);
        this.context.stroke();

        this.context.fillStyle = "black";
        this.context.beginPath();
        this.context.arc(xRight + holeOffset, yTop - holeOffset, holeRadius, 0, 2 * Math.PI);
        this.context.fill();

        // bottom right hole
        this.context.strokeStyle = Table.COLOR;
        this.context.lineCap = "round";
        this.context.lineWidth = 1.9 * holeRadius;
        this.context.beginPath();
        this.context.moveTo(xRight - holeOffset, yBottom - holeOffset);
        this.context.lineTo(xRight + holeOffset, yBottom + holeOffset);
        this.context.stroke();

        this.context.fillStyle = "black";
        this.context.beginPath();
        this.context.arc(xRight + holeOffset, yBottom + holeOffset, holeRadius, 0, 2 * Math.PI);
        this.context.fill();

        // bottom middle hole
        this.context.strokeStyle = Table.COLOR;
        this.context.lineCap = "round";
        this.context.lineWidth = 1.9 * holeRadius;
        this.context.beginPath();
        this.context.moveTo(xMiddle, yBottom);
        this.context.lineTo(xMiddle, yBottom + holeRadius);
        this.context.stroke();

        this.context.fillStyle = "black";
        this.context.beginPath();
        this.context.arc(xMiddle, yBottom + holeRadius, holeRadius, 0, 2 * Math.PI);
        this.context.fill();

        // bottom left hole
        this.context.strokeStyle = Table.COLOR;
        this.context.lineCap = "round";
        this.context.lineWidth = 1.9 * holeRadius;
        this.context.beginPath();
        this.context.moveTo(xLeft + holeOffset, yBottom - holeOffset);
        this.context.lineTo(xLeft - holeOffset, yBottom + holeOffset);
        this.context.stroke();

        this.context.fillStyle = "black";
        this.context.beginPath();
        this.context.arc(xLeft - holeOffset, yBottom + holeOffset, holeRadius, 0, 2 * Math.PI);
        this.context.fill();
    }
}

Table.WIDTH = scaleRealCentimetersToPixel(270);
Table.HEIGHT = scaleRealCentimetersToPixel(270 / 2);
Table.COLOR = "green";
Table.BORDER_OUTER_COLOR = "#432918";
Table.BORDER_INNER_COLOR = "#7d4e24";
Table.BORDER_WIDTH = 20;
