// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

// Create the options form from the JSON schema.
// @TODO Improve form validation and make it impossible to set configurations that will break the extension.
// @TODO Currently, it may be possible to break the extension through bad configuration.
// @TODO Especially add REGEX validation to the list of screen names.
var optionsFormSchema = {
  "schema": {
    "surveySchema": {
      "type": "string",
      "title": "JSON Schema for the survey form",
    "description": "JSON Schema for the survey form that will be injected (displayed). Click <a href='https://jsonform.github.io/jsonform/playground/index.html?example=fields-help'>here</a> to learn how to build your own schema.",
	  "required": true
    },
    "userList": {
      "type": "string",
      "title": "List of screen names to be annotated",
	  "description": "Comma separated list of screen names to be annotated for the guided mode. Can be left empty if the guided mode won't be used."
    },	
    "injectElement": {
      "type": "string",
      "title": "Element ID or Class",
	  "description": "ID or Class for the container HTML element where the survey will be injected into.",
	  "default": "global-nav-inner",
	  "required": true
    },	
	"injectElementType": {
      "type": "string",
      "title": "Element type",
	  "description": "Is the container element for injection identified by a class name or ID.",
	  "default": "class",
	  "required": true,
	  "enum": [
        "class",
		"ID"
      ],
	  "required": true
    },	
    "injectIndex": {
      "type": "number",
      "title": "Element index",
	  "description": "Index of the occurence of the class for the container element where the survey will be injected into. Ignored for IDs since they are unique.",
	  "default": 0,
	  "required": true
    },	
    "mediaPlatform": {
      "type": "string",
      "title": "Social media platform",
	  "required": true,
      "enum": [
        "twitter"
      ]
    },
    "exportFormat": {
      "type": "string",
      "title": "Export file format",
	  "description": "Select the format for the results file that can be exported.",
	  "required": true,
      "enum": [
        "csv"
      ]
    }
  },
  "form": [
    {
      "key": "surveySchema",
      "type": "ace",
      "aceMode": "json",
      "aceTheme": "twilight",
      "width": "100%",
      "height": "200px"
    },
	{
      "key": "userList",
      "type": "textarea"
    },
	{
      "key": "mediaPlatform",
	  "titleMap": {
        "twitter": "Twitter"
      }
    },
	{
      "type": "fieldset",
      "title": "Advanced",
      "expandable": true,
      "items": [
        "exportFormat",
		{
		  "type": "fieldset",
		  "title": "Inject Element",
		  "items": [
			"injectElement",
			"injectElementType",
			"injectIndex"
		  ]
		}
      ]
    }
  ]
}

$('#optionsForm').jsonForm(optionsFormSchema);