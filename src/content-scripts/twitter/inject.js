// @TODO: This list can be generated with help of collections but this will do for now.
// Context class is defined in shared.js

const availableContextsTwitter = [new Context('twitter-user', injectTwitterUserSurvey, checkUserURL),
    new Context('twitter-tweet', injectTwitterTweetSurvey, null)];

// https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
// Select the node that will be observed for mutations
const reactRoot = document.getElementById('react-root');

// Options for the observer (which mutations to observe)
const obsConfig = { attributes: true, childList: false, subtree: true, attributeFilter: ['role'], attributeOldValue: true};

const observerCallback = function(mutationsList, observer) {
    let primaryColID = 'primaryColumn';
    let attName = 'data-testid';
    for (let mutation of mutationsList) {
        if (mutation.type === 'attributes') {
            if (mutation.target.getAttribute('role') === "article") {
                // this event fires every time mouseover on tweet container because attributes are changing, just check
                // if the survey is already in there before injecting. There may be a better way but I'm just dealing
                // with this.
                // maybe later...
                if (mutation.target.parentNode.getElementsByClassName('survey-container-tweet').length === 0) {
                    injectTwitterTweetSurvey(mutation.target)
                }
            }
        }
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(observerCallback);

// Start observing the target node for configured mutations
// observer.observe(reactRoot, config);


function crawlUserName() {
    var currentURL = window.location.href;
    var temp = currentURL.split('.com/');
    temp = temp[temp.length - 1];
    temp = temp.split('/')[0].split('?')[0];
    return temp;
}

function injectTwitterUserSurvey(injectElement) {
    // @ TODO maybe this should wait for load, there might be a race condition right now
    // https://stackoverflow.com/questions/13917047/how-to-get-a-content-script-to-load-after-a-pages-javascript-has-executed
    var surveyContainer = document.createElement('div');
    surveyContainer.className = "survey-container-user";

    var survey = document.createElement('form');
    survey.setAttribute("id", "userSurveyForm"); // TODO: This ID should be unique when importing multiple forms into page
    survey.setAttribute("surveyInitTimestamp", Math.floor(Date.now() / 1000));
    survey.setAttribute("surveyId", crawlUserName());
    surveyContainer.appendChild(survey);

    // Inject the form to the appropriate element in the page.
    var barElementName = injectElement.name;
    var fixedBar = {};
    if (injectElement.type === "class") {
        //fixedBar = document.getElementsByClassName(barElementName)[injectElement.index];
        fixedBar = document.getElementById('react-root');
    } else if (injectElement.type === "id") {
        fixedBar = document.getElementById(barElementName);
    }

    fixedBar.insertAdjacentElement('beforebegin', surveyContainer);
}

function enableTweetObserver(injectElement) {
    observer.observe(reactRoot, obsConfig)
}

function extractTweetDetails(articleNode) {
    // there is only one time element, at least for now...
    let tweetLink = articleNode.querySelector("time").parentNode.href;
    tweetLink = tweetLink.split('/');

    return {tweetOwner: tweetLink[3], tweetID: tweetLink[tweetLink.length - 1]} //last element is the id
}

var tweetCount = 0;
function injectTwitterTweetSurvey(injectNode) {
    // @ TODO This shall be done by mutation observer so it supports new tweets too
    // alert('attempting to inject tweets');
    let surveyContainer = document.createElement('div');
    surveyContainer.className = "survey-container-tweet";

    let survey = document.createElement('form');
    survey.setAttribute("id", "tweetSurveyForm-" + tweetCount++);
    survey.setAttribute("surveyInitTimestamp", Math.floor(Date.now() / 1000));
    let tweetDetails = extractTweetDetails(injectNode);
    survey.setAttribute("surveyId", tweetDetails.tweetID);
    // this information is kind of redundant since it can be learned from tweetID, however it does make life easier
    survey.setAttribute("tweetOwner", tweetDetails.tweetOwner);  //@TODO Rename this to userID so it matches with rest. If user survey, this column will have smth, and elementID won't.
    surveyContainer.appendChild(survey);

    injectNode.insertAdjacentElement('afterbegin', surveyContainer);
}

function checkUserURL() {
    // content script won't be loaded if its not actually twitter, so all I need to check
    //  is if its the main page or not. Anything thats not the main page is a user page
    //  @TODO exclude settings page from the manifest blob match.
    let uname = crawlUserName();
    return !(uname === '' || uname === 'home')
    /*

    let currentURL = window.location.href;
    let isUserURL = true;

    if (currentURL == "https://twitter.com/" || currentURL == "https://twitter.com/home") {
        isUserURL = false;
    }

    return isUserURL;
    */
}

// get the current config from storage
chrome.storage.local.get(['config', 'isEnabled', 'activeTargetList', 'clientID'], function (result) {
    // check if context is enabled
    // @TODO implement this check in a way that will eliminate typo issues.
    // let currentContext = 'twitter-user';
    const currentPlatform = 'twitter';  // manifest ensures this file is only called for twitter.
    for (index = 0; index < availableContextsTwitter.length; ++index) {
        let currentContext = availableContextsTwitter[index];
        if (!currentContext.name.includes(currentPlatform)) {
            continue;
        }
        let contextFlag = result.config.activeSurveys.includes(currentContext.name);
        let auxFlag = currentContext.auxiliaryCheck();
        if (result.isEnabled === true && contextFlag === true && auxFlag === true) {
        // if (true) {
            // there can be more than one survey active at one time, so iterate over a list
            // of currentContext if necessary instead of direct assignment.
            // var activeSurvey = result.config.activeSurvey;
            var activeSurvey = currentContext.name;
            var config = result.config['surveys'][activeSurvey];

            // @TODO for survey-tweet, have this method call start the observer, form template rendering also need to
            //      happen on the observer callback, pass parameters related to that to this method as well.
            currentContext.injectSurvey(config.injectElement);
            // injectSurvey(currentContext, config.injectElement);

            // Attach the onSubmit event handler to the schema
            let formTemplate = config.surveyFormSchema;
            let studyID = config.studyID;
            let clientID = config.clientID;

            function submitAction(errors, values) {
                let bringNextUser = false;
                let platform = currentPlatform;
                let nextUser = '';
                values.surveyType = currentContext.name;
                values.studyID = studyID;
                values.clientID = clientID;
                storeResults(values, platform);  // store values and updateUserID field
            }

            // @TODO this one renders the header only, move that into a DOM load event as well.
            formTemplate.onSubmit = submitAction;
            $('#surveyForm').jsonForm(formTemplate);
        }
    }
});
