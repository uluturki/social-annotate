// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.set({annotationCount: 0}, function() {
    console.log('Annotation count is started from 0.');
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
