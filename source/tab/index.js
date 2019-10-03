import { onIdentifiedTarget, watchLogin } from "./login.js";
import { attachLaunchButton } from "./launch.js";
import {
    getConfig,
    getLastLoginStatus,
    getSourcesStats,
    startMessageListeners,
    transferLoginCredentials
} from "./messaging.js";
import { getSharedTracker } from "./LoginTracker.js";
import { showSaveDialog } from "./saveDialog.js";
import { watchInputs } from "./generator.js";
import { trackMouseMovement, trackScrolling } from "../shared/library/mouseEvents.js";
import { trackKeydownEvent } from "../shared/library/keyboardEvents.js";
import { watchForRegistrationPossibility } from "./myButtercup.js";

function checkForLoginSaveAbility() {
    return Promise.all([getLastLoginStatus(), getConfig(), getSourcesStats()])
        .then(([loginStatus, config, sourceStats]) => {
            const unlockedCount = sourceStats.unlocked;
            const canShowSaveDialog =
                config.showSaveDialog === "always" || (config.showSaveDialog === "unlocked" && unlockedCount > 0);
            if (loginStatus.credentials && canShowSaveDialog) {
                showSaveDialog();
            }
        })
        .catch(err => {
            console.error("An error occurred while communicating with the Buttercup extension");
            console.error(err);
        });
}

// Wait for a target
function waitAndAttachLaunchButtons() {
    onIdentifiedTarget(loginTarget => {
        const { usernameField, passwordField } = loginTarget;
        if (passwordField) {
            attachLaunchButton(passwordField);
        }
        if (usernameField) {
            attachLaunchButton(usernameField);
        }
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
                setTimeout(() => {
                    checkForLoginSaveAbility();
                }, 300);
            }
        );
    });
}

// Manage login form detection
waitAndAttachLaunchButtons();

// Watch for inputs that can be used with password generation
watchInputs();

// Handle app communication
startMessageListeners();

// Check to see if any logins were recorded
checkForLoginSaveAbility();

// Track mousemove events for user activity tracking
trackMouseMovement();
trackScrolling();

// Track keystrokes for user activity tracking
trackKeydownEvent();

// Setup My Buttercup integrations
setTimeout(watchForRegistrationPossibility, 100);
