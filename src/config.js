// submitAction will probably be necessary to be tacked on in inject.js
var config = {
    "exportFormat": "csv",
    "activeSurveys": ["twitter-user"], // "twitter-tweet", "instagram-user"   
    "surveys": {
        "twitter-user":{  // - in the name will cause issues when accessing this element.
            "socialMediaPlatform": "twitter",
            "injectElement": {"name": "global-nav-inner", "type": "class", "index": 0},
            // "injectElementType": "class",
            // "injectElementIndex": "0",
            "screenNameList": ["strictlynofun", "onurvarol", "realdonaldtrump", "ContraPoints", "Kanopy"],
            "surveyFormSchema" : {
              "schema": {
                "userID": {
                  "type": "string",
                  "title": "ID for annotated user",
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
        },
        "twitter-tweet":{
            "socialMediaPlatform": "twitter",
            "formFile": "forms/twitter-tweet.json"
        },
        "instagram-user":{
            "socialMediaPlatform": "instagram",
            "formFile": "forms/instagram-user.json"
        }
    }
};
// config.onSubmit = submitAction;
