'use strict';

fetch('score.json')
  .then(response => response.json())
  .then(json => asynchronJson(json));

 function asynchronJson(json){
	console.log(json);
	
	json.scores.sort((x,y)=>y.score-x.score);
	
    // CREATE DYNAMIC TABLE.
    var table = document.createElement("table");
	
    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
    var tr = table.insertRow(-1);                   // TABLE ROW.

    var th = document.createElement("th");      // TABLE HEADER.
    th.innerHTML = "Name";
    tr.appendChild(th);
    
	var th = document.createElement("th");      // TABLE HEADER.
    th.innerHTML = "Score";
    tr.appendChild(th);
    
    // ADD JSON DATA TO THE TABLE AS ROWS.
    for(let i = 0; i < json.scores.length; i++) {

        tr = table.insertRow(-1);

		var tabCell = tr.insertCell(-1);
		tabCell.innerHTML = json.scores[i].name;

		var tabCell = tr.insertCell(-1);
		tabCell.innerHTML = json.scores[i].score;
		table.appendChild(tr);		
    }

    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById("text");
    divContainer.innerHTML = "";
	divContainer.appendChild(table);

 }
 