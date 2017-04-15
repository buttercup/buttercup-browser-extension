import { sendTabMessage } from "./context";

export default function addListeners() {
    chrome.commands.onCommand.addListener(function(command) {
        switch (command) {
            case "login-with-first-credentials": {
                sendTabMessage({ command: "fill-first-form" });
                break;
            }
            default:
                // skip, we don't know it
                break;
        }
    });
}
