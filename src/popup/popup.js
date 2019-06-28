'use strict';

// Display the number of annotated users in the storage.
var annotationCountSpan = document.getElementById('annotationCount');

chrome.storage.local.get('annotatedUserIDs', function(data) {
  let annotationCount = 0;
  annotationCount = data.annotatedUserIDs.length;
  annotationCountSpan.innerText = annotationCount;
});


function exportStoredResults (items) {
	// Save as file
	var result = JSON.stringify(items);
    var url = 'data:application/json;base64,' + btoa(result);
    chrome.downloads.download({
        url: url,
        filename: 'filename_of_exported_file.json'
    });
}
// @TODO add an enable/disable app switch and an enable/disable going over the list switch. 
// @TODO also throw in a link to the options page.
