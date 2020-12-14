# Social Annotate

Helps annotating social media content and users by bringing everything in a single screen and keeping records straight.

## Getting started

* Clone/download the repo.
* Using Google Chrome (only Chrome is supported at the moment): Go to the extensions page at chrome://extensions and turn on the developer mode. Hit "Load unpacked" button and select the "src" directory in the repository. For details, refer to the Google Chrome documentation:
https://developer.chrome.com/extensions/getstarted
* You can manage the extension and export annotated data using the extension popup. Click the extension logo to the right of the address bar on the browser to access the popup.
* In the options page, you can find advanced features like customizing survey questions for your study and defining an API endpoint to post the results to. More documentation on these will be coming soon, feel free to reach us for help until then.
* Extension is activated on Twitter by default with a placeholder survey.  
* You can now annotate accounts!


# A Visual Demo Is Worth a Thousand Words

Please see our short demo for setting up the system and using for data annotation.

[![Youtube Video](https://github.com/uluturki/twitter_annotate/blob/master/docs/img/youtube-thumbnail.png)](https://www.youtube.com/watch?v=rSJiVwJzM2k)


# We released v1.0!

You can find latest screenshots from our tests below.

![user annotation_real](https://github.com/uluturki/twitter_annotate/blob/master/docs/img/content-annotator_tweet_survey_example.png)

![tweet annotation_real](https://github.com/uluturki/twitter_annotate/blob/master/docs/img/content-annotator_user_survey_example_new.png)

![user annotation_instagram](https://github.com/uluturki/twitter_annotate/blob/master/docs/img/content-annotator_instagram_user_survey_example.png)

# Community guidelines

We are looking for potential user scenarios/stories so we can support them properly. If you have a use case, or suggestions, let us know! 

## Contribute to the software

If you would like to contribute, check out the issues and please provide your changes through pull-requests. We are looking for additional use cases to incorporate with our system.

## Customizing annotation forms

Surveys forms can have an arbitrary number of questions of various types, according to the needs of the study. We rely on JSON schemas as templates for easy configuration and sharing custom survey forms. These surveys are then injected into the page when the URL matches with the target domain. It is possible to have different types of surveys for each platform, which will also effect which elements the surveys are injected to. For example, it is possible to annotate users or tweets on Twitter. Please check out our visual demo above.

## Extending to other platforms

social-annotate is designed with easy deployment to different social media platforms in mind. In order to extend the extension for different platforms, all that is necessary to be done is to implement the content script that will be injected to the page, and update configuration, initialization, and manifest files. 

You can find a complete example of extending to Instagram in our accompanying [manuscript](https://github.com/uluturki/social-annotate/blob/master/manuscript/manuscipt-preview.pdf).

## Report issues or problems with the software

If you notice any problem with this tool, please submit an issue on this repository. If you have any question, you can also reach us through our public profiles: @onurvarol and @uluturki
