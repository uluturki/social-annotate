// Turn the background color to a godawful color so we know app is doing its thing.
document.body.style.backgroundColor="orange";

var surveyContainer = document.createElement('div');
surveyContainer.className = "survey-container";

var survey = document.createElement('form');
survey.setAttribute("id", "surveyForm");
surveyContainer.appendChild(survey)

// @TODO: Read where to append the survey from a config file.
var barClassName = "global-nav-inner";
var fixedBar = document.getElementsByClassName(barClassName);
fixedBar[0].appendChild(surveyContainer);
// var i;
// for (i = 0; i < fixedBar.length; i++) {
	// fixedBar[i].appendChild(survey);
// }

function getCurrentScreenName() {
	headerCardClass = 'ProfileHeaderCard-screenname';
	screenNameClass = 'u-linkComplex-target';
	headerCard = document.getElementsByClassName(headerCardClass);
	screenNameContainer = headerCard[0].getElementsByClassName(screenNameClass);	
	screenName = screenNameContainer[0].innerText;
	
	return screenName;
}

// @TODO: Store the received values. And maybe send them to an API endpoint.
function submitAction(errors, values) {
	
	//@TODO: Switch to userID grabbed from the API instead of screenName.
	values.userID = getCurrentScreenName();
	
	if (errors) {
		alert('I beg your pardon?');
	} else {
		alert('Hello ' + values.bot + '. ' +
			 'I know that you are ' + values.cool + '. UserID: ' + values.userID);
	}
	
	storeResults(values);
}


var resultsArray = []
// @TODO: Implement a caching mechanism so won't have to write every submit to storage.
// Race conditions should not occur because events are called sequentially. 
storeResults = function(surveyResults) {
	// get annotated count and increment that too. Also annotatedUserIDs.
	chrome.storage.local.get(['resultsArray', 'annotatedUserIDs'], function(result) {
		console.log('Number of recorded results: ' + result.resultsArray.length);
		// @TODO Check if the user record already exists, and overwrite if it does.
		// @TODO Notify before overwriting though...
		resultsArray = result.resultsArray;
		annotatedUserIDs = result.annotatedUserIDs;
		
		// keeping a separate list of IDs for quick access, doesn't take much space.
		resultsArray.push(surveyResults);
		annotatedUserIDs.push(surveyResults.userID);
		
		chrome.storage.local.set({'resultsArray': resultsArray, 'annotatedUserIDs': annotatedUserIDs}, function() {
			// Notify that we saved.
			alert('Settings saved');
		});
	});
      
	
	
	
}

// @TODO: Read this form template from somewhere.
formTemplate = {
  "schema": {
	"userID": {
      "type": "string",
      "title": "Annotated User ID",
      "default": "88888"
    },
	"bot": {
	  "type": "string",
	  "title": "Do you believe this user to be a bot?",
	  "enum": [ "bot", "NOTbot"],
	  "required": true
	},
	"cool": {
	  "type": "string",
	  "title": "Is this user cool?",
	  "enum": [ "cool", "NOTcool"],
	  "required": true
	}
  },
  onSubmit: submitAction,
  "form": [
	{
      "key": "userID",
      "type": "hidden"
    },
	{
	  "key": "bot",
	  "type": "radiobuttons",
	  "activeClass": "btn-success"
	},
	{
	  "key": "cool",
	  "type": "radiobuttons",
	  "activeClass": "btn-success"
	},
	{
	  "type": "submit",
	  "title": "Submit"
	}
  ]
}

$('#surveyForm').jsonForm(formTemplate);