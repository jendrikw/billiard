'use strict';

// converts a dimension of an official pool table to pixel for the canvas
function scaleRealCentimetersToPixel(cm) {
    return cm * 2.1;
}

function getContext(id) {
	// Fehlerabfangen TODO
    return document.getElementById(id).getContext("2d");
}
