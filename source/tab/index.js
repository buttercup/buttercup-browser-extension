import { onIdentifiedTarget, watchLogin } from "./login.js";
import { attachLaunchButton } from "./launch.js";
import {
    getConfig,
    getDisabledSavePromptDomains,
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
import { currentDomainDisabled } from "./page.js";

function checkForLoginSaveAbility() {
    return Promise.all([getLastLoginStatus(), getConfig(), getSourcesStats(), getDisabledSavePromptDomains()])
        .then(([loginAvailable, config, sourceStats, disabledDomains]) => {
            if (currentDomainDisabled(disabledDomains)) return;
            const unlockedCount = sourceStats.unlocked;
            const canShowSaveDialog =
                config.showSaveDialog === "always" || (config.showSaveDialog === "unlocked" && unlockedCount > 0);
            if (loginAvailable && canShowSaveDialog) {
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
        const tracker = getSharedTracker();
        tracker.registerConnection(loginTarget);
        const { usernameField, passwordField } = loginTarget;
        if (passwordField) {
            attachLaunchButton(passwordField);
        }
        if (usernameField) {
            attachLaunchButton(usernameField);
        }
        const connection = tracker.getConnection(loginTarget);
        tracker.on("credentialsChanged", creds => {
            transferLoginCredentials({
                ...creds, // username & password
                id: connection.id,
                url: tracker.url,
                title: tracker.title,
                timestamp: Date.now()
            });
        });
        watchLogin(
            loginTarget,
            username => {
                const connection = tracker.getConnection(loginTarget);
                connection.username = username;
            },
            password => {
                const connection = tracker.getConnection(loginTarget);
                connection.password = password;
            },
            () => {
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
