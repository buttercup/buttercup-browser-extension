import LoginForm, { FIRST_FORM_INC, generateFormID } from "./LoginForm";
import matching from "./matching";

// const RESPOND_ASYNC = true;
const RESPOND_SYNC = false;

function autoFillForm(form, submit) {
    matching
        .getItemsForCurrentURL()
        .then(function(items) {
            if (items.length > 0) {
                form.onEntryClick(items[0], submit);
            } else {
                // no items
            }
        })
        .catch(function(err) {
            console.error(err);
        });
}

function handleRequest(request /* , sender, sendResponse */) {
    switch (request.command) {
        case "fill-form": {
            const form = LoginForm.getSelectedForm();
            if (form) {
                autoFillForm(form, request.submit);
            }
            break;
        }

        case "fill-first-form": {
            const firstFormID = generateFormID(FIRST_FORM_INC);
            const firstForm = LoginForm.getFormWithID(firstFormID);
            if (firstForm) {
                autoFillForm(firstForm, true);
            }
            break;
        }

        default:
            // unrecognised command
            break;
    }
    return RESPOND_SYNC;
}

export default function addListeners() {
    chrome.runtime.onMessage.addListener(handleRequest);
}
