import { LoginTarget, LoginTargetFeature } from "@buttercup/locust";
import { onNavigate } from "on-navigate";
import { getSharedTracker } from "../LoginTracker.js";
import { getCredentialsForID, transferLoginCredentials } from "./saving.js";
import { getDisabledDomains } from "./disabled.js";
import { currentDomainDisabled, getCurrentDomain } from "../../library/page.js";
import { log } from "../log.js";
import { getConfig } from "../../../shared/queries/config.js";

async function checkForLoginSaveAbility(loginID: string) {
    const [disabledDomains, config, used] = await Promise.all([
        getDisabledDomains(),
        getConfig(),
        getCredentialsForID(loginID)
    ]);
    if (!used) return;
    if (currentDomainDisabled(disabledDomains)) {
        log(`login available, but current domain disabled: ${getCurrentDomain()}`);
        return;
    }
    if (!config.saveNewLogins) return;
    console.log("PROMPT SAVE", used);
    // Promise
    //     .all([
    //         getLastLoginStatus(),
    //         getConfig(),
    //         getSourcesStats(),
    //         getDisabledSavePromptDomains()
    //     ])
    //     .then(([loginAvailable, config, sourceStats, disabledDomains]) => {
    //         if (currentDomainDisabled(disabledDomains)) return;
    //         const unlockedCount = sourceStats.unlocked;
    //         const canShowSaveDialog =
    //             config.showSaveDialog === "always" || (config.showSaveDialog === "unlocked" && unlockedCount > 0);
    //         if (loginAvailable && canShowSaveDialog) {
    //             showSaveDialog();
    //         }
    //     })
    //     .catch(err => {
    //         console.error("An error occurred while communicating with the Buttercup extension");
    //         console.error(err);
    //     });
}

export function initialise() {
    const tracker = getSharedTracker();
    tracker.on("credentialsChanged", (details) => {
        transferLoginCredentials({
            username: details.username,
            password: details.password,
            id: details.id,
            url: tracker.url,
            title: tracker.title,
            timestamp: Date.now(),
            fromEntry: details.entry
        });
    });
}

export function watchCredentialsOnTarget(loginTarget: LoginTarget): void {
    const tracker = getSharedTracker();
    tracker.registerConnection(loginTarget);
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
            const connection = tracker.getConnection(loginTarget);
            setTimeout(() => {
                checkForLoginSaveAbility(connection.id);
            }, 300);
        }
    );
}

function watchLogin(
    target: LoginTarget,
    usernameUpdate: (value: string) => void,
    passwordUpdate: (value: string) => void,
    onSubmit: () => void
) {
    target.on("valueChanged", (info) => {
        if (info.type === LoginTargetFeature.Username) {
            usernameUpdate(info.value);
        } else if (info.type === LoginTargetFeature.Password) {
            passwordUpdate(info.value);
        }
    });
    target.on("formSubmitted", (info) => {
        if (info.source === "form") {
            onSubmit();
        }
    });
    onNavigate(() => {
        onSubmit();
    });
}
