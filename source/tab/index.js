import FormFinder from "./FormFinder";
import submissions from "./submissions";
import addListeners from "./messaging";
import { placeStylesheet } from "../common/styles";
import { processAccessToken } from "./dropbox";
import { hideContextMenu, showContextMenu } from "./context";
import LoginForm from "./LoginForm";

const ff = new FormFinder();

setInterval(function() {
    ff.findLoginForms().forEach(function(form) {
        form.placeContextButtons();
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

document.body.addEventListener("mouseover", function(e) {
    const { target: potentialFormInput } = e;
    if (potentialFormInput.tagName && potentialFormInput.tagName.toLowerCase() === "input") {
        if (potentialFormInput.hasAttribute("data-buttercup-input")) {
            const form = LoginForm.getFormWithID(potentialFormInput.getAttribute("data-buttercup-form-id"));
            if (form) {
                form.select();
                showContextMenu();
            }
            return;
        }
    }
    // LoginForm.deselect();
    hideContextMenu();
});

addListeners();

// let SP = require("./SavePrompt.js"),
//     sp = new SP();
// sp.show();
