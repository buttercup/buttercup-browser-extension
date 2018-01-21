import isVisible from "isvisible";
import { waitForTarget } from "./login.js";
import { attachLaunchButton } from "./launch.js";
import { startMessageListeners } from "./messaging.js";

// Wait for a target
const waitAndAttachLaunchButtons = () => {
    return waitForTarget()
        .then(loginTarget => {
            const { usernameFields, passwordFields } = loginTarget;
            const [passwordField] = passwordFields;
            const [usernameField] = usernameFields;
            if (passwordField && isVisible(passwordField)) {
                attachLaunchButton(passwordField);
            }
            if (usernameField) {
                attachLaunchButton(usernameField);
            }
        })
        .then(() => {
            setTimeout(() => {
                waitAndAttachLaunchButtons();
            }, 500);
        });
};

waitAndAttachLaunchButtons();

startMessageListeners();
