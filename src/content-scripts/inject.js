document.body.style.backgroundColor="orange";

var survey = document.createElement('div');
survey.className = "survey-container";
survey.innerHTML = "Attention! Military software detected. Top secret clearance required.";

var fixedBar = document.getElementsByClassName("global-nav-inner");
// There is only one of these, if twitter adds another one, will have to reconsider.
fixedBar[0].appendChild(survey);
// var i;
// for (i = 0; i < fixedBar.length; i++) {
	// fixedBar[i].appendChild(survey);
// }


