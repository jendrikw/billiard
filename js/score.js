'use strict';
/*
let myRequest = new Request('score.json');

fetch(myRequest)
.then(function(response) {
  if (!response.ok) {
    throw new Error('HTTP error, status = ' + response.status);
  }
  return response.blob();
})
.then(function(response) {
  console.log(response);
});
*/
var json;
fetch('../score.json')
  .then(response => response.json())
  .then(jsonResponse => json = jsonResponse);

  var obj = JSON.parse(json);