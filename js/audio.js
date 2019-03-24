'use strict';

function toggleMusic() {
    const music = document.getElementById('music');
    try {
        if (music.paused) {
            music.play();
        } else {
            music.pause();
            music.currentTime = 0;
        }
    } catch (err) {
        console.log("Es gab ein Problem mit der Musik. " + err);
    }

}

function toggleClass() {
    const cm = document.getElementById('control-music');
    if (cm.className === "mute") {
        cm.className = "unmute";
    } else {
        cm.className = "mute";
    }
}

