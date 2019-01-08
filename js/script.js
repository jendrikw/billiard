'use strict';

function onload() {
	try{
		Cue.IMG = document.getElementById("cue-img");
	    Cue.WIDTH = Cue.IMG.naturalHeight * (Cue.LENGTH / Cue.IMG.naturalWidth);
	} catch(err) {
		console.log("Es gab einen Fehler beim Cue. " + err);
	}

    let game = new Game();
    game.start();
}
