const FormFinder = require("./FormFinder.js");

console.log("Init");

let ff = new FormFinder();
ff.findLoginForms().forEach(function(form) {
    form.placeContextButton();
});
