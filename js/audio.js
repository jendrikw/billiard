'use strict';

function stopMusic(){
	const music=document.getElementById('audio_with_controls');
	if(music.paused == false)
	{
		music.pause();
		music.currentTime=0;
	}
	else{
		music.play();
	}
}

function toggleText(button_id) 
{
   if (document.getElementById(button_id).innerText == "Musik aus") 
   {
       document.getElementById(button_id).innerText = "Musik an";
   }
   else 
   {
     document.getElementById(button_id).innerText = "Musik aus";
   }
}