'use strict';

function onload() {
    // load score-data from local storage
    let scores = localStorage.getItem("scores");
    console.log("Loaded scores: ", scores);
    // if scores don't exists use an empty array, if not parse the json data in an array
    if (scores === null) {
        scores = {scores: []};
    } else {
        try {
            scores = JSON.parse(scores);
        } catch (e) {
            console.log("Fehler beim laden der scores aus dem localStorage: ", e);
            localStorage.removeItem("scores");
        }
    }

    // load the json file with the dummy scores
    fetch('score.json')
        .then(response => response.json())
        .then(json => createTable(scores.scores.concat(json.scores)))
        .catch(e => {
            console.log("konnte scores.json nicht laden", e);
            createTable(scores.scores);
        });
}


function createTable(scores) {
    // sort the scores descending
    scores.sort((x, y) => y.score - x.score);

    // create table
    const table = document.createElement("table");

    // create html table header row using the extracted headers above.
    // table row
    let tr = table.insertRow(-1);

    // table header
    let th = document.createElement("th");
    th.innerHTML = "Name";
    tr.appendChild(th);

    // table header
    th = document.createElement("th");
    th.innerHTML = "Score";
    tr.appendChild(th);

    // add json data to the table as rows
    for (let i = 0; i < scores.length; i++) {

        tr = table.insertRow(-1);

        let tabCell = tr.insertCell(-1);
        tabCell.innerHTML = scores[i].name;

        tabCell = tr.insertCell(-1);
        tabCell.innerHTML = scores[i].score;
        table.appendChild(tr);

    }

    // finally add the newly created table with json data to a container
    const divContainer = document.getElementById("table");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);

}
