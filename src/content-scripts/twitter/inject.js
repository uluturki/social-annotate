
// Context class is defined in shared.js
// @TODO make this array a struct to avoid magic indices.
const availableContextsTwitter = [new Context('twitter-user', injectTwitterUserSurvey, checkUserURL),
    new Context('twitter-tweet', enableTweetObserver, null)];


// https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
// Select the node that will be observed for mutations
const reactRoot = document.getElementById('react-root');

// Options for the observer (which mutations to observe)
const obsConfig = { attributes: true, childList: false, subtree: true, attributeFilter: ['role'], attributeOldValue: true};
// @TODO All this observer stuff needs to be twitter specific, so that instagram etc. can have theirs as well.
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
                let insertElement = mutation.target.parentNode.parentNode;  // i wish there was a better way to get to this.
                if (insertElement.getElementsByClassName('survey-container-tweet').length === 0) {
                    let tweetDetails = extractTweetDetails(insertElement);

                    injectTwitterTweetSurvey(insertElement, tweetDetails.tweetID);
                    availableContextsTwitter[1].renderSurvey(tweetDetails.tweetOwner, tweetDetails.tweetID);  // @TODO magic index, todo at definition.
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
    let currentURL = window.location.href;
    let temp = currentURL.split('.com/');
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
    survey.setAttribute("id", "surveyForm"); // TODO: This ID should be unique when importing multiple forms into page
    // @TODO !!! replace these with invisible fields on the form.
    // survey.setAttribute("surveyInitTimestamp", Math.floor(Date.now() / 1000));
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

// var tweetCount = 0;
function injectTwitterTweetSurvey(injectNode, tweetID) {
    // @ TODO This shall be done by mutation observer so it supports new tweets too
    // alert('attempting to inject tweets');
    let surveyContainer = document.createElement('div');
    surveyContainer.className = "survey-container-tweet";

    let survey = document.createElement('form');
    survey.setAttribute("id", "surveyForm-" + tweetID);
    // survey.setAttribute("surveyInitTimestamp", Math.floor(Date.now() / 1000));
    survey.classList.add("surveyFormTweet");
    surveyContainer.appendChild(survey);

    injectNode.insertAdjacentElement('afterbegin', surveyContainer);

    // return tweetCount++;  // well its a global variable but this is the fastest way for now.
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

            // Attach the onSubmit event handler to the schema

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

            currentContext.formTemplate = config.surveyFormSchema;
            currentContext.submitAction = submitAction;

            currentContext.injectSurvey(config.injectElement);
            // twitter-tweet renders inside the observer callback, observer is enabled with injectSurvey on the line
            // above, so it is guaranteed to never call render before it was defined and set.
            if (currentContext.name !== 'twitter-tweet') {
                surveyID = crawlUserName();
                currentContext.renderSurvey(surveyID);
            }
        }
    }
});
