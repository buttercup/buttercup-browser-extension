import isVisible from "isvisible";
import { waitForTarget, watchLogin } from "./login.js";
import { attachLaunchButton } from "./launch.js";
import { startMessageListeners, transferLoginCredentials } from "./messaging.js";
import { getSharedTracker } from "./LoginTracker.js";

const watchedTargets = [];

// Wait for a target
const waitAndAttachLaunchButtons = () => {
    return waitForTarget()
        .then(loginTarget => {
            const { usernameField, passwordField } = loginTarget;
            if (passwordField && isVisible(passwordField)) {
                attachLaunchButton(passwordField);
            }
            if (usernameField) {
                attachLaunchButton(usernameField);
            }
            if (watchedTargets.includes(loginTarget.form) !== true) {
                watchedTargets.push(loginTarget.form);
                watchLogin(
                    loginTarget,
                    username => {
                        const tracker = getSharedTracker();
                        tracker.username = username;
                    },
                    password => {
                        const tracker = getSharedTracker();
                        tracker.password = password;
                    },
                    () => {
                        const tracker = getSharedTracker();
                        const now = new Date();
                        transferLoginCredentials({
                            username: tracker.username,
                            password: tracker.password,
                            url: tracker.url,
                            title: tracker.title,
                            timestamp: now.getTime()
                        });
                    }
                );
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
