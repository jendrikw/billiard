'use strict';

function toggleMusic() {
    const music = document.getElementById('audio-controls');
    if (music.paused) {
        music.play();
    } else {
        music.pause();
        music.currentTime = 0;
    }
}

function toggleText(button) {
    if (button.innerText === "Musik aus") {
        button.innerText = "Musik an";
    } else {
        button.innerText = "Musik aus";
    }
}
