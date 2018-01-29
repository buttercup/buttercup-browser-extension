import { getLoginTarget } from "@buttercup/locust";

const TARGET_SEARCH_INTERVAL = 1500;

export function enterLoginDetails(username, password, login = false) {
    return waitForTarget().then(loginTarget => {
        if (login) {
            loginTarget.login(username, password);
        } else {
            loginTarget.enterDetails(username, password);
        }
    });
}

export function identifySelectedInput(inputElement) {
    const target = getLoginTarget();
    const { usernameFields, passwordFields } = target;
    if (usernameFields.includes(inputElement)) {
        return "username";
    } else if (passwordFields.includes(inputElement)) {
        return "password";
    }
    return null;
}

export function waitForTarget() {
    return new Promise(resolve => {
        let check;
        const findTarget = () => {
            const target = getLoginTarget();
            if (target) {
                clearInterval(check);
                resolve(target);
                return true;
            }
        };
        const alreadyFound = findTarget();
        if (!alreadyFound) {
            check = setInterval(findTarget, TARGET_SEARCH_INTERVAL);
        }
    });
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
