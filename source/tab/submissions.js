import SavePrompt from "./SavePrompt";
import formatting from "./formatting";

const MAX_LOGIN_TIME =      30; // seconds
const NOPE =                function() {};

export default {

    clearLastSubmission: function() {
        chrome.runtime.sendMessage({
            command: "clear-last-submission"
        }, NOPE);
    },

    processLastSubmission: function() {
        chrome.runtime.sendMessage(
            { command: "last-form-submission" },
            function(response) {
                if (response && response.ok && response.data) {
                    let timeSince = (Date.now() - response.data.time) / 1000;
                    if (timeSince <= MAX_LOGIN_TIME) {
                        let prompt = new SavePrompt();
                        prompt.show();
                    }
                }
                // chrome.runtime.sendMessage({ command: "save-form-submission", data: { time: 0 } }, NOPE);
            }
        );
    },

    trackFormData: function(pageTitle, inputValues) {
        chrome.runtime.sendMessage({
            command: "save-form-submission",
            data: {
                time: Date.now(),
                values: inputValues,
                pageTitle,
                url: formatting.formatURLForSaving(window.location.href),
                loginURL: window.location.href
            }
        }, NOPE);
    }

};
