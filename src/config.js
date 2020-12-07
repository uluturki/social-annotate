// submitAction will probably be necessary to be tacked on in inject.js
// {
//         "twitter-user": true,
//         "twitter-tweet": false,
//         "instagram-user": false
//     } ,
var config = {
    "exportFormat": "csv",
    "apiEndpoint": "",  // http://127.0.0.1:5000/response
    "activeSurveys": ["twitter-user"], // "twitter-tweet", "instagram-user"
    "surveys": {
        // "instagram-user":{
        //     "socialMediaPlatform": "instagram",
        //     "studyID": "alpha",
        //     "injectElement": {"name": "", "type": "class", "index": 0},
        //     "surveyFormSchema" : {
        //       "surveyFormSchema" : {
        //       "schema": {
        //         "influencer": {
        //           "type": "string",
        //           "title": "Do you believe this user to be a influencer?",
        //           "enum": [ "influencer", "NOT influencer"],
        //           "required": true
        //         },
        //         "authentic": {
        //           "type": "string",
        //           "title": "Is this user authentic?",
        //           "enum": [ "authentic", "NOT authentic"],
        //           "required": true
        //         }
        //       },
        //       "form": [
        //         {
        //           "key": "influencer",
        //           "type": "radiobuttons",
        //           "activeClass": "btn-success"
        //         },
        //         {
        //           "key": "authentic",
        //           "type": "radiobuttons",
        //           "activeClass": "btn-success"
        //         },
        //         {
        //           "type": "submit",
        //           "title": "Submit",
        //           "htmlClass": "surveySubmitBtn"
        //         }
        //       ]
        //     }
        //   }
        // },
        "twitter-tweet":{
            "socialMediaPlatform": "twitter",
            "injectElement": {},  // not using this for tweets, its kind of complicated to find the tweets and no point in making it configurable, "name": "article", "type": "role", "index": 0
            "studyID": "kokone",
            "surveyFormSchema" : {
                "schema": {
                    "english": {
                        "type": "string",
                        "title": "Is this tweet writted in English?",
                        "enum": [ "yes", "no"],
                        "required": true
                    },
                    "conversation": {
                        "type": "string",
                        "title": "Is this a part of conversation?",
                        "enum": [ "yes", "no"],
                        "required": true
                    }
                },
                "form": [
                    {
                        "key": "english",
                        "type": "radiobuttons",
                        "activeClass": "btn-success"
                    },
                    {
                        "key": "conversation",
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
        },
        "twitter-user":{  // - in the name will cause issues when accessing this element.
            "socialMediaPlatform": "twitter",
            "injectElement": {
              "name": "global-nav-inner", 
              "type": "class", 
              "index": 0
            },
            "studyID": "maruko",
            "screenNameList": [],
            "surveyFormSchema" : {
              "schema": {
                "bot": {
                  "type": "string",
                  "title": "Do you believe this user to be a bot?",
                  "enum": [ "Yes", "No"],
                  "required": true
                },
                "confidence": {
                  "type": "integer",
                  "title": "How confident with your response to bot question?",
                  "description": "0 for least and 5 for the most confident",
                  "default": 3,
                  "minimum": 0,
                  "maximum": 5,
                  "exclusiveMinimum": true,
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
                  "key": "confidence",
                  "type": "range",
                  "activeClass": "btn-success"
                },
                {
                  "type": "submit",
                  "title": "Submit",
                  "htmlClass": "surveySubmitBtn"
                }
              ]
            }
        },
        "instagram-user":{  // - in the name will cause issues when accessing this element.
            "socialMediaPlatform": "instagram",
            "injectElement": {
                "name": "global-nav-inner",
                "type": "class",
                "index": 0
            },
            "studyID": "maruko",
            "screenNameList": [],
            "surveyFormSchema" : {
                "schema": {
                    "bot": {
                        "type": "string",
                        "title": "Do you believe this user to be a bot?",
                        "enum": [ "Yes", "No"],
                        "required": true
                    },
                    "celebrity": {
                        "type": "string",
                        "title": "Is this a celebrity user?",
                        "enum": [ "Yes", "No"],
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
                        "key": "celebrity",
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
