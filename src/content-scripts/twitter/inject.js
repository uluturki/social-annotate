// @TODO: This list can be generated with help of collections but this will do for now.
// Context class is defined in shared.js

const availableContextsTwitter = [new Context('twitter-user', injectTwitterUserSurvey, checkUserURL),
    new Context('twitter-tweet', injectTwitterTweetSurvey, null)];

// https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
// Select the node that will be observed for mutations
const reactRoot = document.getElementById('react-root');

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true, attributeFilter: ['role'], attributeOldValue: true};

// var flagg = true
// Callback function to execute when mutations are observed
const observerCallback = function(mutationsList, observer) {
    let primaryColID = 'primaryColumn';
    let attName = 'data-testid';
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            // if (mutation.target.getAttribute('data-testid') === "tweet") {
            //     alert('fukken bingo');
            // }
            for (let addedNode of mutation.addedNodes) {
                // tweets are note added with anythings discernible so addedNodes isn't working for what I need.
                // console.log(addedNode.getAttribute('role'));
            }
        }
        else if (mutation.type === 'attributes') {
            if (mutation.target.getAttribute('role') === "article") {
                // This catches it, but also retriggers after each mouseover for some reason. both new and old values
                // are article when that happens, because change happens in the parent node css class. I should probably
                // just check if survey exists, and if it does, do nothing. not great but I can't find a better way.
                // console.log('role: ' + mutation.target.getAttribute('role'));
                // console.log(mutation.oldValue);
                // this event fires every time on mouseover because attributes are changing, just check if the survey
                // is already in there.
                // console.log(mutation.target.getElementsByClassName('survey-container-twitter'));
                if (mutation.target.parentNode.getElementsByClassName('survey-container-tweet').length === 0) {
                    injectTwitterTweetSurvey(mutation.target)
                }
                // mutation.target.innerText = 'BOYABAT';
                // if (flagg === true) {
                //     mutation.target.innerText = 'HEYHAT';
                //     flagg = false;
                // }
            }

            // if (mutation.attributeName === 'role') {
            //     // if(mutation.target.getAttribute('data-testid') === 'tweet') {
            //     //     // var surveyContainer = document.createElement('div');
            //     //     // surveyContainer.className = "survey-container";
            //     //     //
            //     //     // var survey = document.createElement('form');
            //     //     // survey.setAttribute("id", "surveyForm2"); // TODO: This ID should be unique when importing multiple forms into page
            //     //     // survey.setAttribute("surveyInitTimestamp", Math.floor(Date.now() / 1000));
            //     //     // survey.setAttribute("surveyId", crawlUserName());
            //     //     // surveyContainer.appendChild(survey);
            //     //     //
            //     //     // mutation.target.insertAdjacentElement('beforebegin', surveyContainer);
            //     //     alert(mutation.target.getAttribute('data-testid'))
            //     // }
            //
            // }
        }
    }
};


// Create an observer instance linked to the callback function
const observer = new MutationObserver(observerCallback);

// Start observing the target node for configured mutations
observer.observe(reactRoot, config);


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
    survey.setAttribute("id", "surveyForm"); // TODO: This ID should be unique when importing multiple forms into page
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

var tweetCount = 0;
function injectTwitterTweetSurvey(injectNode) {
    // @ TODO This shall be done by mutation observer so it supports new tweets too
    // alert('attempting to inject tweets');
    let surveyContainer = document.createElement('div');
    surveyContainer.className = "survey-container-tweet";

    let survey = document.createElement('form');
    survey.setAttribute("id", "surveyForm" + tweetCount++); // TODO: This ID should be unique when importing multiple forms into page
    survey.setAttribute("surveyInitTimestamp", Math.floor(Date.now() / 1000));
    survey.setAttribute("surveyId", crawlUserName());
    surveyContainer.appendChild(survey);

    // // Inject the form to the appropriate element in the page.
    // // let tweetElementName = injectElement.name;
    // let tweetElementName = 'article';  // role='article' brings tweets only it seems.
    // //fixedBar = document.getElementsByClassName(barElementName)[injectElement.index];
    //
    // let articleDivList = document.querySelectorAll(tweetElementName);
    // alert('number of divs ' + string(articleDivList.length));
    // for (const articleDiv of articleDivList) {
    //     articleDiv.insertAdjacentElement('beforebegin', surveyContainer);
    // }
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
chrome.storage.local.get(['config', 'isEnabled', 'activeTargetList'], function (result) {
    // check if context is enabled
    // @TODO implement this check in a way that will eliminate typo issues.
    // let currentContext = 'twitter-user';
    for (index = 0; index < availableContextsTwitter.length; ++index) {
        let currentContext = availableContextsTwitter[index];
        if (!currentContext.name.includes('twitter')) {
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

            var screenNameStack = result.screenNameStack;

            currentContext.injectSurvey(config.injectElement);
            // injectSurvey(currentContext, config.injectElement);

            // Attach the onSubmit event handler to the schema
            var formTemplate = config.surveyFormSchema;

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
