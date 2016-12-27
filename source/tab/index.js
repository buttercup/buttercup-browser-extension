const FormFinder = require("./FormFinder.js");
const submissions = require("./submissions.js");

let ff = new FormFinder();
ff.findLoginForms().forEach(function(form) {
    form.placeContextButton();
});

submissions.processLastSubmission();

if (/^https:\/\/buttercup\.pw/i.test(window.location.href)) {
    require("./dropbox.js").processAccessToken(window.location.hash);
}
