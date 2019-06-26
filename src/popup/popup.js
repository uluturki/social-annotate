'use strict';

// Display the number of annotated users in the storage.
var annotationCountSpan = document.getElementById('annotationCount');

chrome.storage.local.get('annotatedUserIDs', function(data) {
  let annotationCount = 0;
  annotationCount = data.annotatedUserIDs.length;
  annotationCountSpan.innerText = annotationCount;
});

