import { LoginTarget, getLoginTargets } from "@buttercup/locust";
import { attachLaunchButton } from "../ui/launch.js";
import { watchCredentialsOnTarget } from "./logins/watcher.js";
import { InputType } from "../types.js";

const TARGET_SEARCH_INTERVAL = 1000;

function onIdentifiedTarget(callback: (target: LoginTarget) => void) {
    const locatedForms = [];
    const findTargets = () => {
        getLoginTargets()
            .filter((target) => locatedForms.includes(target.form) === false)
            .forEach((target) => {
                locatedForms.push(target.form);
                setTimeout(() => {
                    callback(target);
                }, 0);
            });
    };
    const checkInterval = setInterval(findTargets, TARGET_SEARCH_INTERVAL);
    setTimeout(findTargets, 0);
    return {
        remove: () => {
            clearInterval(checkInterval);
            locatedForms.splice(0, locatedForms.length);
        }
    };
}

export function waitAndAttachLaunchButtons(
    onInputActivate: (input: HTMLInputElement, loginTarget: LoginTarget, inputType: InputType) => void
) {
    onIdentifiedTarget((loginTarget: LoginTarget) => {
        const { otpField, usernameField, passwordField } = loginTarget;
        if (otpField) {
            attachLaunchButton(otpField, (el) => onInputActivate(el, loginTarget, InputType.OTP));
        }
        if (passwordField) {
            attachLaunchButton(passwordField, (el) => onInputActivate(el, loginTarget, InputType.UserPassword));
        }
        if (usernameField) {
            attachLaunchButton(usernameField, (el) => onInputActivate(el, loginTarget, InputType.UserPassword));
        }
        watchCredentialsOnTarget(loginTarget);
    });
}
