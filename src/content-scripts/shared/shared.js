// @TODO Check if this ID already exists in storage, and just update if it does (avoid duplicates).
// @TODO Might have an allow duplicates checkbox in the config, if there is a use case for it.
// Race conditions should not occur because events are called sequentially. 
function getCurrentScreenName(platform) {
    if (platform === "twitter") {
        /*
        headerCardClass = 'ProfileHeaderCard-screenname';
        screenNameClass = 'u-linkComplex-target';
        headerCard = document.getElementsByClassName(headerCardClass);
        screenNameContainer = headerCard[0].getElementsByClassName(screenNameClass);    
        screenName = screenNameContainer[0].innerText;
        */
        var currentURL = window.location.href;
        var temp = currentURL.split('.com/');
        temp = temp[temp.length-1];
        screenName = temp.split('/')[0].split('?')[0];
    } else {
        screenName = 'Mahmut';
        //throw "Not implemented yet"
    }
    
    return screenName;
}

const metadataSchemes = {
    "initTimestamp": {
        "type": "number",
        "title": "Initial Timestamp",
        "default": 0
    },
    "userID": {
        "type": "string",
        "title": "User ID",
        "default": "hohe"
    },
    "postID": {
        "type": "string",
        "title": "Post(tweet) ID",
        "default": "hahi"
    }
};

const metadataForms = [
    {
        "key": "initTimestamp",
        "type": "hidden",
        "activeClass": "btn-success"
    },
    {
        "key": "userID",
        "type": "hidden",
        "activeClass": "btn-success"
    },
    {
        "key": "postID",
        "type": "hidden",
        "activeClass": "btn-success"
    }
];

const notificationContainer = document.createElement('DIV');
notificationContainer.classList.add('notification-container');
let placeholderSpan = document.createElement('SPAN');
// placeholderSpan.innerText = "getittogether.";
notificationContainer.appendChild(placeholderSpan);

const overwriteSpan = document.createElement('SPAN');
overwriteSpan.classList.add('notification-message-overwrite');
overwriteSpan.innerHTML = "Record already exists. New submissions will overwrite.";  // add span here

const successSpan = document.createElement('SPAN');
successSpan.classList.add('notification-message-success');
successSpan.innerHTML = "Submission Successful!";  // add span here


class Context {

    constructor(contextName, injectFunction, auxCheckFunction) {
        this.name = contextName;
        this.injectSurvey = injectFunction;
        // this.renderSurvey = renderFunction;  // render function is set after construction
        if(auxCheckFunction !== null) {
            this.auxiliaryCheck = auxCheckFunction;
        }else{
            this.auxiliaryCheck = function() { return true;}
        }
        this.formTemplate = null;
        this.submitAction = null;
    }

    // @TODO Use tweet ID instead of separate formID.
    renderSurvey(userID, postID=null) {
        // @TODO attach these metadata fields in a separate setter.
        // Attach the onSubmit event handler to the schema
        this.formTemplate.onSubmit = this.submitAction;
        // attach the metadata fields to the template
        for (let key in metadataSchemes) {
            if (metadataSchemes.hasOwnProperty(key)) {
                this.formTemplate.schema[key] = metadataSchemes[key];
            }
        }
        for (let item of metadataForms) {
            this.formTemplate.form.splice(this.formTemplate.form.length-1, 0, item);
        }
        // fill in the attached metadata fields.
        this.formTemplate.schema["initTimestamp"].default = Math.floor(Date.now() / 1000);
        this.formTemplate.schema["userID"].default = userID;

        let formName = '#surveyForm';
        if (postID != null) {
            this.formTemplate.schema["postID"].default = postID;
            formName = formName + '-' + postID.toString()
        }

        $(formName).jsonForm(this.formTemplate);

        // @TODO This part is a bit piecemeal, some CSS work can make it so that a single all encompassing div is
        //      inserted once for all cases, but that's for future.
        let divName = "surveyForm";
        if (this.name === "twitter-tweet"){
            divName += '-' + postID.toString();
        }

        let surveyContainer = document.getElementById(divName);
        let injectContainer = surveyContainer.children[0];
        if (this.name === "twitter-user"){
            injectContainer = surveyContainer.children[0].children[0];  // guaranteed to be there, though it doesn't look good.
        }

        let nc = notificationContainer.cloneNode(true);  // from shared.js
        injectContainer.insertAdjacentElement('beforebegin', nc);

        let surveyType = this.name;
        // Check if this one is already annotated.
        chrome.storage.local.get(['annotatedElements'], function(result) {
            // This one is only called for tweets, though a more general implementation would be nice in the future.
            let checkID = (postID === null ? userID : postID);
            let entryIndex = result.annotatedElements[surveyType].indexOf(checkID);  // for tweets, this keeps userIDs not tweetIDs, UPDATE THAT!.
            if (entryIndex !== -1) {  // if an entry already exists
                let os = overwriteSpan.cloneNode(true);  // from shared.js
                nc.replaceChild(os, nc.firstChild);
            }
        });
    }

}

// @TODO: ideally, failure should be handled/retried on the background, overall failure handling is a bit lacking,
//          can use some further work.
const failureSpan = document.createElement('SPAN');
failureSpan.classList.add('notification-message-failure');
failureSpan.innerHTML = "Submission Failed. Please try again.";  // add span here

function storeResults(surveyResults, socialMediaPlatform) {
    //surveyResults.userID = getCurrentScreenName(socialMediaPlatform);
    // surveyResults.userID = document.getElementById('surveyForm').getAttribute('surveyId');
    surveyResults.postTimestamp = Math.floor(Date.now() / 1000);
    // surveyResults.initTimestamp = document.getElementById('surveyForm').getAttribute('surveyInitTimestamp');

    _gaq.push(['_trackEvent', 'SurveySubmitted', 'clicked']); // Track number of survey submitted by Google Analytics.

    let apiSuccess = true;
    chrome.storage.local.get(['config'], function(result){
        if(result.config.apiEndpoint !== ''){
            apiSuccess = false;
            let headers = new Headers();
            headers.append('Accept', 'application/json');
            headers.append('Access-Control-Allow-Origin', '*');
            headers.append('Content-Type', 'application/json');

            fetch(result.config.apiEndpoint, {
              mode: 'no-cors',
              method: "POST",
              body: JSON.stringify(surveyResults),
              headers: headers
            }).then(res => {
              console.log("Request complete! response:", res);
              // @TODO might not necessarily be success here, handle response types.
              apiSuccess = true;
            });
        }
    });

    // get annotated count and increment that too. Also annotatedUserIDs.
    chrome.storage.local.get(['resultsArrays', 'annotatedElements', 'activeTargetList', 'isGuided', 'clientID'], function(result) {
        // console.log('Number of recorded results: ' + result.resultsArray.length);

        surveyResults.clientID = result.clientID;

        resultsArrays = result.resultsArrays;
        annotatedElements = result.annotatedElements;
        activeTargetList = result.activeTargetList;
        
        // @TODO: store this in the config when adding more platforms.
        if (socialMediaPlatform == 'twitter') {
            platformURL = "https://twitter.com/";
        }

        let surveyType = surveyResults.surveyType;

        // @TODO update for tweet storage.
        // check if this user is already in storage, and if so, where.
        let insertKey = null;
        if (surveyType === 'twitter-user') {
            insertKey = surveyResults.userID;
        }
        else if (surveyType === 'twitter-tweet') {
            insertKey = surveyResults.postID;
        }

        let insertIndex = annotatedElements[surveyType].indexOf(insertKey);
        if (insertIndex === -1) {
            // keeping a separate list of IDs for quick access, doesn't take much space.
            // resultsArray.push(surveyResults);
            // annotatedUserIDs.push(surveyResults.userID);
            // this index appends to the end of the list.
            insertIndex = resultsArrays[surveyType].length;
        }

        resultsArrays[surveyType][insertIndex] = surveyResults;
        annotatedElements[surveyType][insertIndex] = insertKey;
        
        let lists2update = {
            'resultsArrays': resultsArrays,
            'annotatedElements': annotatedElements,
        };
        
        var bringNextUser = false;
        // if guided mode is enabled in the popup UI
        if (result.isGuided === true && surveyType === 'twitter-user') {  // @TODO support guided mode for tweets too.
            // drop the saved user ID from the list, if it exists in the list.

            // dropIndex = activeTargetList.indexOf(surveyResults.userID);
            // issue#3: making the comparison non case sensitive to handle cases
                        // where twitter corrects the userid.
            dropIndex = activeTargetList.findIndex(item => surveyResults.userID.toLowerCase() === item.toLowerCase());
            if (dropIndex > -1) {  // -1 when no match
                activeTargetList.splice(dropIndex,1);  // remove 1 element, starting from dropIndex
            }
            
            // If guided mode is active and there are users in the list, determine next in line. 
            
            var nextUser = '';
            
            if (activeTargetList.length > 0) {
                bringNextUser = true;
                nextUser = activeTargetList[0]; // pop from the list when successfully submitted, not beforehand.
            }
            
            lists2update.activeTargetList = activeTargetList;
            
        }
        chrome.storage.local.set(lists2update, function() {
            // TODO Update this part for tweets as well, first figure which type is submitted, then construct url
            //  accordingly
            if (bringNextUser === true){
                // can't use tabs api within content script.
                window.location.href = platformURL + nextUser;
            }

            if (apiSuccess){  // @TODO: endpoint error handling isn't done properly, all parts part related to API needs
                                // full on exception handling.
                let divName = "surveyForm";
                if (surveyResults.surveyType === "twitter-tweet"){
                    divName += '-' + surveyResults.postID.toString();
                }

                let ss = successSpan.cloneNode(true);  // @TODO: Have this blink so works for back2back submissions. can remove the span in submit click to achieve that maybe.

                let surveyContainer = document.getElementById(divName);
                // @TODO: this part is also a bit piecemeal, work on a universally injectable single div.
                let nc = null;
                if (surveyResults.surveyType === "twitter-tweet") {
                    // notification container is guaranteed to exist here as the only sibling of surveyCont, grab it and
                    // just clone a span into it.
                    nc = surveyContainer.getElementsByClassName("notification-container")[0];
                }
                else if (surveyResults.surveyType === "twitter-user") {
                    // guaranteed to have one of these
                    nc = surveyContainer.getElementsByClassName("notification-container")[0];
                }
                if (nc !== null) {
                    nc.replaceChild(ss, nc.firstChild);
                    // @TODO Doesn't look good but works when someone hits submit back-to-back. Can use better UI overall.
                    $(ss).fadeOut(0);
                    $(ss).fadeIn(200);
                }
            }

        });
    });
}