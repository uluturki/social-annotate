'use strict';

// Display the number of annotated users in the storage.
var annotationCountSpan = document.getElementById('annotationCount');

chrome.storage.local.get('annotatedUserIDs', function(data) {
  let annotationCount = 0;
  annotationCount = data.annotatedUserIDs.length;
  annotationCountSpan.innerText = annotationCount;
});

document.querySelector('#exportLink').addEventListener('click', function(e) {
	chrome.storage.local.get('resultsArray', function(data) {
		var resultsArray = data.resultsArray;
		exportStoredResults(resultsArray);
	});
});

var disableLink = document.querySelector('#disableLink');
disableLink.addEventListener('click', function(e) {
	// use the link/button as a toggle, toggle between disable and enable.
	if (disableLink.innerHTML === "Disable") {
		// TODO Implement logic here that will let this know by the content script.
		disableLink.innerHTML = "Enable";
	} else if (disableLink.innerHTML === "Enable") {
		// TODO Implement logic here that will let this know by the content script.
		disableLink.innerHTML = "Disable";
	}
});


// @TODO First line is getting messed up as undefined, figure that out.
function exportStoredResults (items) {
	// Save as file
	var csvResults = objectList2csv(items);
    
	var url = 'data:text/plain;charset=utf-8,' + encodeURIComponent(csvResults);
    chrome.downloads.download({
        url: url,
        filename: 'annotations.csv'
    });
}

function objectList2csv(items) {
	var csv
	
	// Loop the array of objects
	for(let row = 0; row < items.length; row++){
		let keysAmount = Object.keys(items[row]).length
		let keysCounter = 0

		// If this is the first row, generate the headings
		if(row === 0){

		   // Loop each property of the object
		   for(let key in items[row]){

							   // This is to not add a comma at the last cell
							   // The '\r\n' adds a new line
			   csv += key + (keysCounter+1 < keysAmount ? ',' : '\r\n' )
			   keysCounter++
		   }
		}else{
		   for(let key in items[row]){
			   csv += items[row][key] + (keysCounter+1 < keysAmount ? ',' : '\r\n' )
			   keysCounter++
		   }
		}

		keysCounter = 0
	}
	return csv
}


// @TODO add an enable/disable app switch and an enable/disable going over the list switch. 
// @TODO also throw in a link to the options page.
