import FormFinder from "./FormFinder";
import submissions from "./submissions";
import { placeStylesheet } from "../common/styles";
import { processAccessToken } from "./dropbox";

let ff = new FormFinder();
ff.findLoginForms().forEach(function(form) {
    form.placeContextButton();
});

placeStylesheet();
submissions.processLastSubmission();

if (/^https:\/\/buttercup\.pw/i.test(window.location.href)) {
    processAccessToken(window.location.hash);
}

// let SP = require("./SavePrompt.js"),
//     sp = new SP();
// sp.show();
