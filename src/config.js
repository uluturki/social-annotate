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
                    "smart": {
                        "type": "string",
                        "title": "Is this tweet smart?",
                        "enum": [ "yes", "no"],
                        "required": true
                    },
                    "pointless": {
                        "type": "string",
                        "title": "Is this tweet pointless?",
                        "enum": [ "yes", "no"],
                        "required": true
                    }
                },
                "form": [
                    {
                        "key": "smart",
                        "type": "radiobuttons",
                        "activeClass": "btn-success"
                    },
                    {
                        "key": "pointless",
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
        },
        "instagram-user":{  // - in the name will cause issues when accessing this element.
            "socialMediaPlatform": "instagram",
            "injectElement": {
                "name": "global-nav-inner",
                "type": "class",
                "index": 0
            },
            "studyID": "maruko",
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
