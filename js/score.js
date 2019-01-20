'use strict';

function onload() {
    let scores = localStorage.getItem("scores");
    if (scores === null) {
        scores = {scores: []};
    } else {
        try {
            scores = JSON.parse(scores);
        } catch (e) {
            console.log("Fehler beim laden der scores aus dem localStorage: ", e);
            localStorage.setItem("scores", JSON.stringify({scores: []}))
        }
    }

    if (scores.scores.length < 10) {
        fetch('score.json')
            .then(response => response.json())
            .then(json => createTable({scores: scores.scores.concat(json.scores)}));
    } else {
        createTable(scores);
    }
}


function createTable(scores) {
    scores.scores.sort((x, y) => y.score - x.score);

    // CREATE DYNAMIC TABLE.
    const table = document.createElement("table");

    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
    let tr = table.insertRow(-1);                   // TABLE ROW.

    let th = document.createElement("th");      // TABLE HEADER.
    th.innerHTML = "Name";
    tr.appendChild(th);

    th = document.createElement("th");      // TABLE HEADER.
    th.innerHTML = "Score";
    tr.appendChild(th);

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (let i = 0; i < scores.scores.length; i++) {

        tr = table.insertRow(-1);

        let tabCell = tr.insertCell(-1);
        tabCell.innerHTML = scores.scores[i].name;

        tabCell = tr.insertCell(-1);
        tabCell.innerHTML = scores.scores[i].score;
        table.appendChild(tr);
    }

    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    const divContainer = document.getElementById("table");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);

}
