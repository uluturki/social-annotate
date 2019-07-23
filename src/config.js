// submitAction will probably be necessary to be tacked on in inject.js
var config = {
    "exportFormat": "csv",
    "apiEndpoint": "http://127.0.0.1:5000/response",
    "activeSurveys": [ "twitter-user", "instagram-user"], // "twitter-tweet", "instagram-user"   
    "surveys": {
        "instagram-user":{
            "socialMediaPlatform": "instagram",
            "injectElement": {"name": "", "type": "class", "index": 0},
            "surveyFormSchema" : {
              "surveyFormSchema" : {
              "schema": {
                "influencer": {
                  "type": "string",
                  "title": "Do you believe this user to be a influencer?",
                  "enum": [ "influencer", "NOT influencer"],
                  "required": true
                },
                "authentic": {
                  "type": "string",
                  "title": "Is this user authentic?",
                  "enum": [ "authentic", "NOT authentic"],
                  "required": true
                }
              },
              "form": [
                {
                  "key": "influencer",
                  "type": "radiobuttons",
                  "activeClass": "btn-success"
                },
                {
                  "key": "authentic",
                  "type": "radiobuttons",
                  "activeClass": "btn-success"
                },
                {
                  "type": "submit",
                  "title": "Submit",
                  "htmlClass": "surveySubmitBtn"
                }
              ]
            }
          }
        },
        "twitter-tweet":{
            "socialMediaPlatform": "twitter",
            "injectElement": {"name": "twitter-xxx", "type": "class", "index": 0},
            "surveyFormSchema" : {
              "schema":{}, "form":{}
            }
        },
        "twitter-user":{  // - in the name will cause issues when accessing this element.
            "socialMediaPlatform": "twitter",
            "injectElement": {
              "name": "global-nav-inner", 
              "type": "class", 
              "index": 0
            },
            "screenNameList": ["strictlynofun", "onurvarol", "realdonaldtrump", "ContraPoints", "Kanopy"],
            "surveyFormSchema" : {
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
                  "title": "Submit",
                  "htmlClass": "surveySubmitBtn"
                }
              ]
            }
        }
    }
};
// config.onSubmit = submitAction;
