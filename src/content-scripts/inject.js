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


// @TODO: Store the received values. And maybe send them to an API endpoint.
submitAction = function (errors, values) {
	if (errors) {
		alert('I beg your pardon?');
	} else {
		alert('Hello ' + values.bot + '.' +
			 'I know that you are ' + values.cool + '.');
	}
}

// @TODO: Read this form template from somewhere.
formTemplate = {
  "schema": {
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