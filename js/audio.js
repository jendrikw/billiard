'use strict';

function stopMusic() {
    const music = document.getElementById('audio_with_controls');
    if (!music.paused) {
        music.play();
    } else {
        music.pause();
        music.currentTime = 0;
    }
}

function toggleText(buttonId) {
    if (document.getElementById(buttonId).innerText === "Musik aus") {
        document.getElementById(buttonId).innerText = "Musik an";
    } else {
        document.getElementById(buttonId).innerText = "Musik aus";
    }
}
