import { getLoginTarget } from "@buttercup/locust";

const TARGET_SEARCH_INTERVAL = 1500;

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
        const check = setInterval(() => {
            const target = getLoginTarget();
            if (target) {
                clearInterval(check);
                resolve(target);
            }
        }, TARGET_SEARCH_INTERVAL);
    });
}
