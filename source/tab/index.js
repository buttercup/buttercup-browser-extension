const FormFinder = require("./FormFinder.js");
const submissions = require("./submissions.js");

console.log("Init");

let ff = new FormFinder();
ff.findLoginForms().forEach(function(form) {
    form.placeContextButton();
});

submissions.processLastSubmission();
