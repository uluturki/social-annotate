
// @TODO: Implement a caching mechanism so won't have to write every submit to storage.
// Race conditions should not occur because events are called sequentially. 
storeResults = function(surveyResults) {
	// get annotated count and increment that too. Also annotatedUserIDs.
	chrome.storage.local.get(['resultsArray', 'annotatedUserIDs'], function(result) {
		// console.log('Number of recorded results: ' + result.resultsArray.length);
		// @TODO Check if the user record already exists, and overwrite if it does.
		// @TODO Notify before overwriting though...
		resultsArray = result.resultsArray;
		annotatedUserIDs = result.annotatedUserIDs;
		
		// keeping a separate list of IDs for quick access, doesn't take much space.
		resultsArray.push(surveyResults);
		annotatedUserIDs.push(surveyResults.userID);
		
		chrome.storage.local.set({'resultsArray': resultsArray, 'annotatedUserIDs': annotatedUserIDs}, function() {
			// console.log('save complete');
		});
	});
}

function getCurrentScreenName(platform) {
	if (platform === "twitter") {
		headerCardClass = 'ProfileHeaderCard-screenname';
		screenNameClass = 'u-linkComplex-target';
		headerCard = document.getElementsByClassName(headerCardClass);
		screenNameContainer = headerCard[0].getElementsByClassName(screenNameClass);	
		screenName = screenNameContainer[0].innerText;
	} else {
		throw "Not implemented yet"
	}
	
	return screenName;
}

// get the current config from storage
chrome.storage.local.get(['config', 'isEnabled'], function(result) {
	if (result.isEnabled === true) {
		var config = result.config;
			
		var surveyContainer = document.createElement('div');
		surveyContainer.className = "survey-container";

		var survey = document.createElement('form');
		survey.setAttribute("id", "surveyForm");
		surveyContainer.appendChild(survey)

		// Inject the form to the appropriate element in the page.
		var barElementName = config.injectElement;
		var fixedBar = {}
		if (config.injectElementType === "class") {
			fixedBar = document.getElementsByClassName(barElementName)[config.injectElementIndex];
		} else if (config.injectElementType === "id") {
			fixedBar = document.getElementById(barElementName);
		}

		fixedBar.appendChild(surveyContainer);
		// var i;
		// for (i = 0; i < fixedBar.length; i++) {
			// fixedBar[i].appendChild(survey);
		// }
		
		// Attach the onSubmit event handler to the schema
		var formTemplate = config.surveyFormSchema;
		
		// @TODO: Send values to an API endpoint if configured to do so.
		function submitAction(errors, values) {
			// @TODO: Modify this so this function definition can be outside the event.
			values.userID = getCurrentScreenName(config.socialMediaPlatform);
			
			// if (errors) {
				// alert('I beg your pardon?');
			// } else {
				// alert('Hello ' + values.bot + '. ' +
					 // 'I know that you are ' + values.cool + '. UserID: ' + values.userID);
			// }
			storeResults(values);
		}
		formTemplate.onSubmit = submitAction;
		$('#surveyForm').jsonForm(formTemplate);
	}
});
