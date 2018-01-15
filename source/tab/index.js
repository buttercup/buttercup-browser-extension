import isVisible from "isvisible";
import { waitForTarget } from "./login.js";
import { attachLaunchButton } from "./launch.js";
import { startMessageListener } from "./messaging.js";

// Wait for a target
waitForTarget().then(loginTarget => {
    const { usernameFields, passwordFields } = loginTarget;
    const [passwordField] = passwordFields;
    const [usernameField] = usernameFields;
    if (passwordField && isVisible(passwordField)) {
        attachLaunchButton(passwordField);
    } else if (usernameField) {
        attachLaunchButton(usernameField);
    }
});

startMessageListener();
