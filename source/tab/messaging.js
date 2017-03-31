import LoginForm from "./LoginForm";
import matching from "./matching";

// const RESPOND_ASYNC = true;
const RESPOND_SYNC = false;

export default function addListeners() {
    chrome.runtime.onMessage.addListener(function(request /* , sender, sendResponse */) {
        switch (request.command) {
            case "fill-form": {
                const form = LoginForm.getSelectedForm();
                if (form) {
                    matching
                        .getItemsForCurrentURL()
                        .then(function(items) {
                            if (items.length > 0) {
                                form.onEntryClick(items[0], request.submit);
                            } else {
                                // no items
                            }
                        })
                        .catch(function(err) {
                            console.error(err);
                        });
                }
                break;
            }

            default:
                // unrecognised command
                break;
        }
        return RESPOND_SYNC;
    });
}
