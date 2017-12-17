import isVisible from "isvisible";
import { waitForTarget } from "./login.js";
import { attachLaunchButton } from "./launch.js";

// const { inContainer: isVisibleInContainer } = createVisibilityDetector();
// const isVisible = el => isVisibleInContainer(el, document.body);

// Wait for a target
waitForTarget().then(loginTarget => {
    // console.log("FORM!", loginTarget);
    // loginTarget.form.style.backgroundColor = "red";
    const { usernameFields, passwordFields } = loginTarget;
    const [passwordField] = passwordFields;
    const [usernameField] = usernameFields;
    // console.log("PASS", passwordField, isVisible(passwordField));
    if (passwordField && isVisible(passwordField)) {
        attachLaunchButton(passwordField);
    } else if (usernameField) {
        attachLaunchButton(usernameField);
    }
});
