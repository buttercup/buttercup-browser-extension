import LoginForm, { FIRST_FORM_INC, generateFormID } from "./LoginForm";
import matching from "./matching";
import { getEntryData } from "./authentication";

// const RESPOND_ASYNC = true;
const RESPOND_SYNC = false;

function autoFillForm(form, submit, comboID) {
    const handleItems = function handleItems(items) {
        if (items.length > 0) {
            form.onEntryClick(items[0], submit);
        } else {
            // no items
        }
    };
    if (comboID) {
        const [archiveID, entryID] = comboID.split("/");
        getEntryData(archiveID, entryID)
            .then(entry => [entry])
            .then(handleItems)
            .catch(function(err) {
                console.error(err);
                alert(`An error occurred when fetching the entry:\n\n${err.message}`);
            });
    } else {
        matching
            .getItemsForCurrentURL()
            .then(handleItems)
            .catch(function(err) {
                console.error(err);
                alert(`An error occurred when fetching entries:\n\n${err.message}`);
            });
    }
}

function handleRequest(request /* , sender, sendResponse */) {
    switch (request.command) {
        case "fill-form": {
            const form = LoginForm.getSelectedForm();
            if (form) {
                if (request.comboID) {
                    autoFillForm(form, request.submit, request.comboID);
                } else {
                    autoFillForm(form, request.submit);
                }
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
