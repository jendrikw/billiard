'use strict';

// converts a dimension of an official pool table to pixel for the canvas
function scaleRealCentimetersToPixel(cm) {
    return cm * 2.2;
}

function onload() {
    Cue.IMG = document.getElementById("cue-img");
    Cue.WIDTH = Cue.IMG.naturalHeight * (Cue.LENGTH / Cue.IMG.naturalWidth);

    let game = new Game();
    game.drawAll();
}



/*
//rotaiting pictures on website
function rotateAnimation(img, degrees){
	img.style.MozTransform = "rotate("+degrees+"deg)";
}
*/
