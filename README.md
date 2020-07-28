# social-annotator
Helps annotating social media content and users by bringing everything in a single screen and keeping records straight.

## Getting started
* Clone/download the repo.
* Using Google Chrome (only Chrome is supported at the moment): Go to the extensions page at chrome://extensions and turn on the developer mode. Hit "Load unpacked" button and select the "src" directory in the repository. For details, refer to the Google Chrome documentation:
https://developer.chrome.com/extensions/getstarted
* You can manage the extension and export annotated data using the extension popup. Click the extension logo to the right of the address bar on the browser to access the popup.
* In the options page, you can find advanced features like customizing survey questions for your study and defining an API endpoint to post the results to. More documentation on these will be coming soon, feel free to reach us for help until then.
* Extension is activated on Twitter by default with a placeholder survey.  
* You can now annotate accounts!


# Going public, v1.0 soon!
We are looking for potential user scenarios/stories so we can support them properly. If you have a use case, or suggestions, let us know!
Instagram support will be live with v1.0 as well.
If you would like to contribute, check out the issues and let us know if you see anything you like.

You can find latest screenshots from our tests below.

![user annotation_real](https://github.com/uluturki/twitter_annotate/blob/master/docs/img/content-annotator_tweet_survey_example.png)

![tweet annotation_real](https://github.com/uluturki/twitter_annotate/blob/master/docs/img/content-annotator_user_survey_example.png)


# Brain storming for the tool

We can consider having a tool to help reseachers to annotate and collect data easily on their browser. [Here](https://chrome.google.com/webstore/detail/twlets-twitter-to-excel/glmadnnfibhnhgboophnodnhbjdogiec) is an example designe to download data. We can do better and add annotation capabilities.

Some design choices can be

- Easy to customize interface for specific tasks. People can design their own study in two levels: Account and content level. 

- Easy to export outcomes. We can provide settings for researchers to select their data collection. User profile metadata and content information can be collected. Data storage can be either a server or browser storage that will give a chance to export as json or CSV file.

Some mockups below

![user annotate](https://github.com/uluturki/twitter_annotate/blob/master/docs/img/user-annotation.png)

![tweet annotation](https://github.com/uluturki/twitter_annotate/blob/master/docs/img/tweet-annotation.png)

