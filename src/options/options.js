$(function () {
    $('[data-toggle="tooltip"]').tooltip();

    $('#save-button').click(function() {
      saveOptionsPage();
    });

    $('#export-button').click(function() {
      exportOptions();
    });

    var fupload = document.getElementById("upload-file");
    fupload.addEventListener("change", handleFileSelect, false);
    $('#import-button').click(function() {
      importOptions();
    });

    loadPage();
});
// @TODO handle clientID in the forms (make it editable)
function loadPage(){
  chrome.storage.local.get(['config', 'isEnabled', 'clientID'], function(result) {
      console.log(result.config);
      document.getElementById('api-endpoint').value = result.config.apiEndpoint;

      var accordionHTML = '';
      for(var key in result.config.surveys){
          var survey = result.config.surveys[key];
          
          html = `<div class="panel panel-default">
                    <div class="panel-heading" role="tab" id="heading_` + key + `">
                      <h4 class="panel-title">
                        <img src="../images/` + survey.socialMediaPlatform + `.png" style="height:32px;">
                        <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse_` + key + `" aria-expanded="true" aria-controls="collapse_` + key + `">
                          ` + key + `
                        </a>
                      </h4>
                    </div>
                    <div id="collapse_` + key + `" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading_` + key + `">
                      <div class="panel-body">
                        <div class="input-group">
                          <span class="input-group-addon" id="lbl-insert-location">
                            Insert location
                            <span class="glyphicon glyphicon-info-sign" data-toggle="tooltip" data-placement="top" title="HTML element class to insert form"></span>
                          </span>
                          <input type="text" class="form-control" id="` + key + `_insert-location" aria-describedby="lbl-insert-location">
                        </div>

                        <h3><small>
                          Form template in JSON format. Validate <a href="https://jsonform.github.io/jsonform/playground/index.html" target="_blank">here</a> 
                          before pasting here. <span class="glyphicon glyphicon-info-sign" data-toggle="tooltip" data-placement="top" title="Make sure JSON is formatted correctly"></span>
                        </small></h3>
                        <textarea id='` + key + `_form-template' class="form-control" rows="10"></textarea>

                        <h3><small>
                          Annotation list
                          <span class="glyphicon glyphicon-info-sign" data-toggle="tooltip" data-placement="top" title="Comma seperated list of usernames"></span>
                        </small></h3>
                        <textarea id='` + key + `_annotation-list' class="form-control" rows="3"></textarea>
                      </div>
                    </div>
                  </div>
                </div>`;

          accordionHTML += html;
      }
      document.getElementById('survey-container').innerHTML = accordionHTML;

      for(var key in result.config.surveys){
        var survey = result.config.surveys[key];
        if(survey.hasOwnProperty('injectElement')){
          document.getElementById(key + '_insert-location').value = survey.injectElement.name;
        }

        if(survey.hasOwnProperty('screenNameList')){
          document.getElementById(key + '_annotation-list').value = survey.screenNameList;
        }

        if(survey.hasOwnProperty('surveyFormSchema')){
          document.getElementById(key + '_form-template').value = JSON.stringify(survey.surveyFormSchema,null,'\t');
        }
      }
      $('[data-toggle="tooltip"]').tooltip();
  });
}

function saveOptionsPage(){
  console.log('Saving');
  chrome.storage.local.get(['config'], function(result) {
    var configData = result.config;

    configData.apiEndpoint = document.getElementById('api-endpoint').value;
    for(var key in configData.surveys){
      var survey = configData.surveys[key];
      if(survey.hasOwnProperty('injectElement')){
        configData.surveys[key].injectElement.name = document.getElementById(key + '_insert-location').value;
      }

      if(survey.hasOwnProperty('screenNameList')){
        configData.surveys[key].screenNameList = document.getElementById(key + '_annotation-list').value;
      }

      if(survey.hasOwnProperty('surveyFormSchema')){
        configData.surveys[key].surveyFormSchema = JSON.parse(document.getElementById(key + '_form-template').value);
      }
    }

    chrome.storage.local.set({'config':configData}, function() {
      console.log('Config data updated');
    });

  });
};

function exportOptions(){
  chrome.storage.local.get(['config'], function(result) {
    console.log(result.config);
    var url = 'data:text/plain;charset=utf-8,' + JSON.stringify(result.config,null,'\t');
    chrome.downloads.download({
        url: url,
        filename: 'config.json'
    });
  });
};

function importOptions(){
  var input = document.getElementById('import-button');
  var configData = JSON.parse(input.getAttribute("import-data"));
  if(configData.hasOwnProperty('surveys')){ // Check surveys key should be in the config file at least.
    chrome.storage.local.set({'config':configData}, function() {
      console.log('Config data updated');
      console.log('Config data', configData);
    });
  }
  //loadPage();
  location.reload();
};

function handleFileSelect(evt)
{
  var files = evt.target.files;
  if(files.length > 1)
  {
    alert('Select only one file!');
  }else{
    var reader = new FileReader();
    reader.onload = function (evt) {
      var config = evt.target.result;
      var inputButton = document.getElementById('import-button');
      inputButton.setAttribute("import-data", config);
    };
    reader.onerror = function (evt) {
        alert("Error reading file");
    }
    reader.readAsText(files[0]);
  }
}
