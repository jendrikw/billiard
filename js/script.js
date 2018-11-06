'use strict';

function onload() {
    Cue.IMG = document.getElementById("cue-img");
    Cue.WIDTH = Cue.IMG.naturalHeight * (Cue.LENGTH / Cue.IMG.naturalWidth);

    let game = new Game();
    game.drawAll();
}
