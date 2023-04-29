import { LoginTarget, getLoginTargets } from "@buttercup/locust";
import { getSharedTracker } from "./LoginTracker.js";
import { attachLaunchButton } from "../ui/launch.js";
import { InputType } from "../types.js";

const TARGET_SEARCH_INTERVAL = 1000;

function onIdentifiedTarget(callback) {
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
    const tracker = getSharedTracker();
    tracker.on("credentialsChanged", (connection) => {
        // transferLoginCredentials({
        //     username: connection.username,
        //     password: connection.password,
        //     id: connection.id,
        //     url: tracker.url,
        //     title: tracker.title,
        //     timestamp: Date.now(),
        //     fromEntry: connection.entry
        // });
    });
    onIdentifiedTarget((loginTarget) => {
        tracker.registerConnection(loginTarget);
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
        watchLogin(
            loginTarget,
            (username) => {
                const connection = tracker.getConnection(loginTarget);
                connection.username = username;
            },
            (password) => {
                const connection = tracker.getConnection(loginTarget);
                connection.password = password;
            },
            () => {
                setTimeout(() => {
                    // checkForLoginSaveAbility();
                }, 300);
            }
        );
    });
}

function watchLogin(target, usernameUpdate, passwordUpdate, onSubmit) {
    target.on("valueChanged", (info) => {
        if (info.type === "username") {
            usernameUpdate(info.value);
        } else if (info.type === "password") {
            passwordUpdate(info.value);
        }
    });
    target.on("formSubmitted", (info) => {
        if (info.source === "form") {
            onSubmit();
        }
    });
}
