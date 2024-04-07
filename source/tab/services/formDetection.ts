import { LoginTarget, LoginTargetFeature, getLoginTargets } from "@buttercup/locust";
import { attachLaunchButton } from "../ui/launch.js";
import { watchCredentialsOnTarget } from "./logins/watcher.js";
import { processTargetAutoLogin } from "./autoLogin.js";
import { InputType } from "../types.js";
import { getConfig } from "./config.js";

const TARGET_SEARCH_INTERVAL = 1000;

function filterLoginTarget(_: LoginTargetFeature, element: HTMLElement): boolean {
    if (element.dataset.bcup === "attached") {
        return false;
    }
    return true;
}

function onIdentifiedTarget(callback: (target: LoginTarget) => void) {
    const locatedForms: Array<HTMLElement> = [];
    const findTargets = () => {
        getLoginTargets(document, filterLoginTarget)
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

export async function waitAndAttachLaunchButtons(
    onInputActivate: (input: HTMLInputElement, loginTarget: LoginTarget, inputType: InputType) => void
) {
    const config = await getConfig();
    onIdentifiedTarget((loginTarget: LoginTarget) => {
        const { otpField, usernameField, passwordField } = loginTarget;
        if (otpField) {
            attachLaunchButton(otpField, config.inputButtonDefault, (el) =>
                onInputActivate(el, loginTarget, InputType.OTP)
            );
        }
        if (passwordField) {
            attachLaunchButton(passwordField, config.inputButtonDefault, (el) =>
                onInputActivate(el, loginTarget, InputType.UserPassword)
            );
        }
        if (usernameField) {
            attachLaunchButton(usernameField, config.inputButtonDefault, (el) =>
                onInputActivate(el, loginTarget, InputType.UserPassword)
            );
        }
        watchCredentialsOnTarget(loginTarget);
        processTargetAutoLogin(loginTarget).catch(console.error);
    });
}
