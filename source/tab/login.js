import { getLoginTarget, getLoginTargets } from "@buttercup/locust";
import { itemIsIgnored } from "./disable.js";

const TARGET_SEARCH_INTERVAL = 1500;

export function enterLoginDetails(username, password, login = false) {
    const loginTarget = getLoginTarget();
    if (loginTarget) {
        if (login) {
            loginTarget.login(username, password);
        } else {
            loginTarget.enterDetails(username, password);
        }
    }
}

export function onIdentifiedTarget(callback) {
    const locatedForms = [];
    const findTargets = () => {
        getLoginTargets()
            .filter(target => locatedForms.includes(target.form) === false)
            .forEach(target => {
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

export function watchLogin(target, usernameUpdate, passwordUpdate, onSubmit) {
    target.on("valueChanged", info => {
        if (info.type === "username") {
            usernameUpdate(info.value);
        } else if (info.type === "password") {
            passwordUpdate(info.value);
        }
    });
    target.on("formSubmitted", info => {
        if (info.source === "form") {
            onSubmit();
        }
    });
}
