'use strict';

function stopMusic(){
const music=document.getElementById('audio_with_controls');
music.pause();
music.currentTime=0;
toggleText(music);

}

function toggleText(el) 
{
   if (el.firstChild.data == "Musik aus") 
   {
       el.firstChild.data = "Musik an";
   }
   else 
   {
     el.firstChild.data = "Musik aus";
   }
}