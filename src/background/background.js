// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function() {

	// This ID is not necessarily unique, but unlikely to hit non-unique ids, extension needs to be installed on the
	//	same millisecond + the 4 character random part needs to match. doesn't follow UUID standard because i'm a bad person.
	// let clientID = '_' + Math.random().toString(36).substr(2, 9);
	let clientID = '_' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 5);

	let initialStorage = {
		"resultsArrays": {
			"twitter-user": [],
			"twitter-tweet": []
		},  // @TODO pull these from a supported types list somewhere.
		"annotatedElements": {
			"twitter-user": [],
			"twitter-tweet": []
		}, // @TODO pull these from a supported types list somewhere.
		"clientID": clientID,
		"config": config,
		"isEnabled": true,
		"isGuided": false,
		"activeTargetList": [...config.surveys["twitter-user"].screenNameList]  // clone the array, keep the initial list for future reference.
	};
	chrome.storage.local.set(initialStorage, function() {
	console.log('Storage arrays initialized.');
	});
	
	// chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // chrome.declarativeContent.onPageChanged.addRules([{
      // conditions: [new chrome.declarativeContent.PageStateMatcher({
        // pageUrl: {hostEquals: 'developer.chrome.com'},
      // })],
      // actions: [new chrome.declarativeContent.ShowPageAction()]
    // }]);
  // });
});


// This is the event that catches HTML5 pushState page transitions:
//	https://stackoverflow.com/questions/20865581/chrome-extension-content-script-not-loaded-until-page-is-refreshed
chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    // @TODO: load necessary content scripts here, this is going to take some work to handle customizability properly
	//	I will leave this out for now.
	
	// Possibly: This can send a message to the content script, which will then rerun itself/restart from checking.
	//		Also see event filters here, we can filter these events to only twitter https://developer.chrome.com/extensions/background_pages
	// chrome.tabs.executeScript(null,{file:"contentscript.js"});
});
  
