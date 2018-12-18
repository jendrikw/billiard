'use strict';

fetch('score.json')
  .then(response => response.json())
  .then(json => asynchronJson(json));

  
 function asynchronJson(json){
	console.log(json);
 }