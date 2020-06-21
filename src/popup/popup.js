'use strict';

document.querySelector('#go-to-options').addEventListener('click', function(e) {
  console.log('Options clicked!');
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
});

function refresh_page(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
    });
}

function updateAnnotationCount () {
    var annotationCountSpan = document.getElementById('annotationCount');
    chrome.storage.local.get(['config', 'annotatedElements'], function(data) {
        // let annotationCount = data.annotatedUserIDs.length;
        // @TODO for now supporting only one active survey at one time, most of the codebase supports multiple just needs
        //      testing and UI updates.
        let activeSurvey = data.config.activeSurveys[0];
        annotationCountSpan.innerText = data.annotatedElements[activeSurvey].length;
    });
}

// Display the number of annotated users in the storage.
var survey = '';
var surveyDropdown = document.getElementById('dropdown-menu');
chrome.storage.local.get('config', function(data) {
    for (var key in data.config.surveys){
        var option = document.createElement('li');
        option.data = key;
        // event for clicking on a survey name on the dropdown, selecting that survey
        option.addEventListener("click", function(){
            // @TODO also keep guided for all different survey types, maybe even enable separately and a separate big
            //      toggle for everything. this needs some thinking.
            let chosenSurvey = this.data;
            document.getElementById('survey-id').innerHTML = chosenSurvey;
            // update the active survey in the stored config variable.
            chrome.storage.local.get('config', function (data) {
                data.config.activeSurveys = [chosenSurvey];
                chrome.storage.local.set({'config':data.config}, function() {
                    // @TODO there are a lot of unnecessary storage calls here, consolidate.
                    updateAnnotationCount();  //@TODO this isn't doing anything.
                });

            });

            refresh_page();

        });

        option.innerHTML = "<a href='#'>" + key + "</a>";
        surveyDropdown.appendChild(option);
    }
    // Set the default as the latest one
    // @TODO for now supporting only one active survey at one time, most of the codebase supports multiple just needs
    //      testing and UI updates.
    survey = data.config.activeSurveys[0];
    document.getElementById('survey-id').innerHTML = survey;
    // @TODO bring together all these update interface functions
    updateAnnotationCount();

});




document.querySelector('#exportLink').addEventListener('click', function(e) {
    chrome.storage.local.get('resultsArrays', function(data) {
        let resultsArrays = data.resultsArrays;
        exportStoredResults(resultsArrays);
    });
});

var toggleGuidedCheckbox = document.querySelector('#toggleGuidedMode');

function updateInterface (disableLink) {
    chrome.storage.local.get(['isEnabled','isGuided'], function(data) {
        let linkText = '';
        if (data.isEnabled === true) {
            linkText = "Disable";
        } else {
            linkText = "Enable";
        }
        disableLink.innerHTML = linkText;
        
        if (data.isGuided === true) {
            toggleGuidedCheckbox.checked = true;
        } else {
            toggleGuidedCheckbox.checked = false;
        }
    });
}

var disableLink = document.querySelector('#disableLink');
// Populate the interface for initial values.
updateInterface(disableLink);


disableLink.addEventListener('click', function(e) {
    // use the link/button as a toggle, toggle between disable and enable.
    // get the current status, flip it and store it again.
    chrome.storage.local.get('isEnabled', function(data) {
        let tempValue = !data.isEnabled;
        chrome.storage.local.set({"isEnabled": tempValue}, function() {
            updateInterface(disableLink)
        });
    });
    // Update the interface (for now just the toggle link)
    refresh_page();
});


toggleGuidedCheckbox.addEventListener('click', function(e) {
    
    var isChecked = false;
    if (toggleGuidedCheckbox.checked == true){
        isChecked = true;
    }

    chrome.storage.local.set({"isGuided": isChecked}, function() {} );
});

// @TODO First line is getting messed up as undefined, figure that out.
function exportStoredResults (resultArrays) {
    // Save as file
    let csvResults = '';
    for (let surveyType in resultArrays) {
        if (resultArrays.hasOwnProperty(surveyType)) {
            csvResults = objectList2csv(resultArrays[surveyType]);
        }

        let fileName = 'annotations-' + surveyType + '.csv';
        fileName = fileName.replace(/-/g ,'_');

        let url = 'data:text/plain;charset=utf-8,' + encodeURIComponent(csvResults);
        chrome.downloads.download({
            url: url,
            filename: fileName
        });
    }
}

function objectList2csv(items) {
    var csv = '';
    
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
           // So that it handles first row of DATA properly after adding headings
           keysCounter = 0
        }
        for(let key in items[row]){
           csv += items[row][key] + (keysCounter+1 < keysAmount ? ',' : '\r\n' )
           keysCounter++
        }


        keysCounter = 0
    }
    return csv
}

