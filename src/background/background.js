// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function() {
	
	let initialStorage = {
	  "resultsArray": [], 
	  "annotatedUserIDs": [], 
	  "config": config, 
	  "isEnabled": true,
	  "isGuided": false,
	  "activeTargetList": [...config.surveys["twitter-user"].screenNameList]  // clone the array, keep the initial list for future reference.
	// OV: Use options page to load this list manually
	}
	// {"resultsArray": [], "annotatedUserIDs": [], "config": config, "isEnabled": true}
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
	
	// chrome.tabs.executeScript(null,{file:"contentscript.js"});
});
  
