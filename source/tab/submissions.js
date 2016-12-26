const SavePrompt = require("./SavePrompt.js");
const formatting = require("./formatting.js");

const MAX_LOGIN_TIME =      30; // seconds
const NOPE =                function() {};

module.exports = {

    processLastSubmission: function() {
        chrome.runtime.sendMessage(
            { command: "last-form-submission" },
            function(response) {
                if (response.ok && response.data) {
                    let timeSince = (Date.now() - response.data.time) / 1000;
                    if (timeSince <= MAX_LOGIN_TIME) {
                        let prompt = new SavePrompt();
                        prompt.show();
                    }
                }
            }
        );
    },

    trackFormData: function(inputValues) {
        chrome.runtime.sendMessage({
            command: "save-form-submission",
            data: {
                time: Date.now(),
                values: inputValues,
                url: formatting.formatURLForSaving(window.location.href),
                loginURL: window.location.href
            }
        }, NOPE);
    }

};
