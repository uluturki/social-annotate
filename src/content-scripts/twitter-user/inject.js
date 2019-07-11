
// @TODO Check if this ID already exists in storage, and just update if it does (avoid duplicates).
// @TODO Might have an allow duplicates checkbox in the config, if there is a use case for it.
// Race conditions should not occur because events are called sequentially. 
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

storeResults = function(surveyResults, socialMediaPlatform,) {
	// get annotated count and increment that too. Also annotatedUserIDs.
	chrome.storage.local.get(['resultsArray', 'annotatedUserIDs', 'activeTargetList', 'isGuided'], function(result) {
		// console.log('Number of recorded results: ' + result.resultsArray.length);
		// @TODO Check if the user record already exists, and overwrite if it does.
		// @TODO Notify before overwriting though...
		
		// @TODO wrap these two in an object so they are always in sync, or switch to a dict.
		resultsArray = result.resultsArray;
		annotatedUserIDs = result.annotatedUserIDs;
		activeTargetList = result.activeTargetList;
		// page is not redirected until submission complete, still can pull the ID from the page.
		surveyResults.userID = getCurrentScreenName(socialMediaPlatform);
		// @TODO: store this in the config when adding more platforms.
		if (socialMediaPlatform == 'twitter') {
			platformURL = "https://twitter.com/";
		}
		// check if this user is already in storage, and if so, where.
		let userIndex = annotatedUserIDs.indexOf(surveyResults.userID);
		if (userIndex === -1) {
			// keeping a separate list of IDs for quick access, doesn't take much space.
			// resultsArray.push(surveyResults);
			// annotatedUserIDs.push(surveyResults.userID);
			// this index appends to the end of the list.
			userIndex = resultsArray.length;
		} 
		resultsArray[userIndex] = surveyResults;
		annotatedUserIDs[userIndex] = surveyResults.userID;
		
		let lists2update = {
			'resultsArray': resultsArray, 
			'annotatedUserIDs': annotatedUserIDs, 
		};
		
		var bringNextUser = false;
		// if guided mode is enabled in the popup UI
		if (result.isGuided === true) {
			// drop the saved user ID from the list, if it exists in the list.
			dropIndex = activeTargetList.indexOf(surveyResults.userID);
			if (dropIndex > -1) {  // -1 when no match
				activeTargetList.splice(dropIndex,1);  // remove 1 element, starting from dropIndex
			}
			
			// If guided mode is active and there are users in the list, determine next in line. 
			
			var nextUser = ''
			
			if (activeTargetList.length > 0) {
				// @TODO Have a toggle on the UI as well.
				bringNextUser = true;
				nextUser = activeTargetList[0] // pop from the list when successfully submitted, not beforehand.
			}
			
			lists2update.activeTargetList = activeTargetList;
			
		}
			
		chrome.storage.local.set(lists2update, function() {
			if (bringNextUser === true){
				// can't use tabs api within content script...
				window.location.href = platformURL + nextUser;
			}

		});
	});
}

// get the current config from storage
chrome.storage.local.get(['config', 'isEnabled', 'activeTargetList'], function(result) {
	if (result.isEnabled === true) {
		var activeSurvey = result.config.activeSurvey;
		var config = result.config['surveys'][activeSurvey];
		
		var screenNameStack = result.screenNameStack;
		
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
			let bringNextUser = false;
			let platform = config.socialMediaPlatform;
			let nextUser = ''

			storeResults(values, platform);  // store values and updateUserID field
		}
		formTemplate.onSubmit = submitAction;
		
		$('#surveyForm').jsonForm(formTemplate);
	}
});
