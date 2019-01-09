'use strict';

fetch('score.json')
  .then(response => response.json())
  .then(json => asynchronJson(json));

  
 function asynchronJson(json){
	console.log(json);
	let table = document.getElementById("TableScores");
	 let i;
	 for (i = 0 ; i<json.size();i++){
		createTableRow(table,i);
	}
 }
 
 function createTableRow(table,i){
	 //TODO createElement inhalte erstellen 
	 
	 
	 table.appendChild(tr);
 }
 