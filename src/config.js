// submitAction will probably be necessary to be tacked on in inject.js
var config = {
	"exportFormat": "csv",
	"socialMediaPlatform": "twitter",
	"injectElement": "global-nav-inner",
	"injectElementType": "class",
	"injectElementIndex": "0",
	"screenNameList": [],
	"surveyFormSchema" : {
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
};
// config.onSubmit = submitAction;
