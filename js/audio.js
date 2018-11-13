'use strict';

function toggleMusic() {
    const music = document.getElementById('music');
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

function toggleClass() {
    const cm = document.getElementById('control-music');
    if (cm.className === "mute"){
        cm.className = "unmute";
    }
    else {
        cm.className = "mute";
    }
}

