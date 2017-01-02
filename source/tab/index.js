const FormFinder = require("./FormFinder.js");
const submissions = require("./submissions.js");
const styles = require("../common/styles.js");

let ff = new FormFinder();
ff.findLoginForms().forEach(function(form) {
    form.placeContextButton();
});

styles.placeStylesheet();
submissions.processLastSubmission();

if (/^https:\/\/buttercup\.pw/i.test(window.location.href)) {
    require("./dropbox.js").processAccessToken(window.location.hash);
}

// let SP = require("./SavePrompt.js"),
//     sp = new SP();
// sp.show();
