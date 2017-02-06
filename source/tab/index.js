import FormFinder from "./FormFinder";
import submissions from "./submissions";
import { placeStylesheet } from "../common/styles";
import { processAccessToken } from "./dropbox";

const ff = new FormFinder();

setInterval(function() {
    ff.findLoginForms().forEach(function(form) {
        form.placeContextButton();
        form.on("formSubmission", function() {
            submissions.processLastSubmission();
        });
    });
}, 350);

placeStylesheet();
submissions.processLastSubmission();

if (/^https:\/\/buttercup\.pw/i.test(window.location.href)) {
    processAccessToken(window.location.hash);
}

// let SP = require("./SavePrompt.js"),
//     sp = new SP();
// sp.show();
