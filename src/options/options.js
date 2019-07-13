$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});

chrome.storage.local.get(['config', 'isEnabled'], function(result) {
    console.log(result.config);

    document.getElementById('survey-container').innerHTML = '';
    for(var key in result.config.surveys){
        var survey = result.config.surveys[key];
        
        // TODO: Read form template from a file located in forms folder?

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
                        <input type="text" class="form-control" id="api-endpoint" aria-describedby="lbl-insert-location">
                      </div>

                      <h3><small>
                        Form template in JSON format
                        <span class="glyphicon glyphicon-info-sign" data-toggle="tooltip" data-placement="top" title="Make sure JSON is formatted correctly"></span>
                      </small></h3>
                      <textarea class="form-control" rows="10"></textarea>

                      <h3><small>
                        Annotation list
                        <span class="glyphicon glyphicon-info-sign" data-toggle="tooltip" data-placement="top" title="Comma seperated list of usernames"></span>
                      </small></h3>
                      <textarea class="form-control" rows="3"></textarea>
                    </div>
                  </div>
                </div>
              </div>`;

        document.getElementById('survey-container').innerHTML += html;

    }

});