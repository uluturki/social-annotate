// @TODO: This list can be generated with help of collections but this will do for now.
// Context class is defined in shared.js
const availableContextsInstagram = [ new Context('instagram-user', injectInstagramUserSurvey, checkUserURL)];


function crawlUserName(){
    var currentURL = window.location.href;
    var temp = currentURL.split('.com/');
    temp = temp[temp.length-1];
    temp = temp.split('/')[0].split('?')[0];
    return temp;
}

function injectInstagramUserSurvey(injectElement) {
    console.log('Trying to insert Instagram');
    var surveyContainer = document.createElement('div');
    surveyContainer.className = "survey-container";

    var survey = document.createElement('form');
    survey.setAttribute("id", "surveyForm"); // TODO: This ID should be unique when importing multuple forms into page
    survey.setAttribute("surveyInitTimestamp", Math.floor(Date.now() / 1000));
    survey.setAttribute("surveyId", crawlUserName());
    surveyContainer.appendChild(survey);

    // Inject the form to the appropriate element in the page.
    var barElementName = injectElement.name;
    var fixedBar = {};
    if (injectElement.type === "class") {
        fixedBar = document.getElementById('react-root');
        //fixedBar = document.getElementsByClassName(barElementName)[injectElement.index];
    } else if (injectElement.type === "id") {
        fixedBar = document.getElementById(barElementName);
    }

    fixedBar.insertAdjacentElement('beforebegin', surveyContainer);
    //fixedBar.appendChild(surveyContainer);
}


function checkUserURL() {
    let uname = crawlUserName();
    return !(uname == '' || uname == 'home')
    /*
    // content script won't be loaded if its not actually twitter, so all I need to check 
    //  is if its the main page or not. Anything thats not the main page is a user page
    //  exclude settings page from the manifest blob match.
    let currentURL = window.location.href;
    let isUserURL = true;
    
    if (currentURL == "https://twitter.com/" || currentURL == "https://twitter.com/home") {
        isUserURL = false;
    }
    
    return isUserURL;
    */
}

// get the current config from storage
chrome.storage.local.get(['config', 'isEnabled', 'activeTargetList'], function(result) {
    console.log('Instagram test');
    // check if context is enabled
    // @TODO implement this check in a way that will eliminate typo issues.
    // let currentContext = 'twitter-user';
    for (index = 0; index < availableContextsInstagram.length; ++index) {
        let currentContext = availableContextsInstagram[index];
        console.log(currentContext);
        if(!currentContext.name.includes('instagram')){
            continue;
        }
        let contextFlag = result.config.activeSurveys.includes(currentContext.name); 
        let auxFlag = currentContext.auxillaryCheck();
        
        if (result.isEnabled === true && contextFlag === true && auxFlag === true) {
            // there can be more than one survey active at one time, so iterate over a list 
            // of currentContext if necessary instead of direct assignment.
            // var activeSurvey = result.config.activeSurvey;
            var activeSurvey = currentContext.name;
            var config = result.config['surveys'][activeSurvey];
            
            var screenNameStack = result.screenNameStack;
            
            currentContext.injectSurvey(config.injectElement);
            // injectSurvey(currentContext, config.injectElement);
            
            // Attach the onSubmit event handler to the schema
            var formTemplate = config.surveyFormSchema;
            
            // @TODO: Send values to an API endpoint if configured to do so.
            function submitAction(errors, values) {
                let bringNextUser = false;
                let platform = config.socialMediaPlatform;
                let nextUser = ''
                values.survey = currentContext.name;
                storeResults(values, platform);  // store values and updateUserID field
            }
            formTemplate.onSubmit = submitAction;
            
            $('#surveyForm').jsonForm(formTemplate);
        }
    }
});
