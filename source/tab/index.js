import isVisible from "isvisible";
import { waitForTarget, watchLogin } from "./login.js";
import { attachLaunchButton } from "./launch.js";
import { getLastLoginStatus, startMessageListeners, transferLoginCredentials } from "./messaging.js";
import { getSharedTracker } from "./LoginTracker.js";
import { showSaveDialog } from "./saveDialog.js";

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
                        transferLoginCredentials({
                            username: tracker.username,
                            password: tracker.password,
                            url: tracker.url,
                            title: tracker.title,
                            timestamp: Date.now()
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

// Manage login form detection
waitAndAttachLaunchButtons();

// Handle app communication
startMessageListeners();

// Check to see if any logins were recorded
getLastLoginStatus()
    .then(result => {
        if (result.credentials) {
            showSaveDialog();
        }
    })
    .catch(err => {
        console.error("An error occurred while communicating with the Buttercup extension");
        console.error(err);
    });
