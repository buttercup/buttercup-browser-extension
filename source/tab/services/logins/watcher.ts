import { LoginTarget, LoginTargetFeature } from "@buttercup/locust";
import { onNavigate } from "on-navigate";
import { getSharedTracker } from "../LoginTracker.js";
import { getCredentialsForID, getLastSavedCredentials, transferLoginCredentials } from "./saving.js";
import { getDisabledDomains } from "./disabled.js";
import { currentDomainDisabled, getCurrentDomain } from "../../library/page.js";
import { log } from "../log.js";
import { getConfig } from "../../../shared/queries/config.js";
import { openDialog } from "../../ui/saveDialog.js";

async function checkForLoginSaveAbility(loginID?: string) {
    const [disabledDomains, config, used] = await Promise.all([
        getDisabledDomains(),
        getConfig(),
        loginID ? getCredentialsForID(loginID) : getLastSavedCredentials()
    ]);
    if (!used || !used.promptSave || used.fromEntry) return;
    if (currentDomainDisabled(disabledDomains)) {
        log(`login available, but current domain disabled: ${getCurrentDomain()}`);
        return;
    }
    if (!config.saveNewLogins) return;
    log("saved login available, show prompt");
    openDialog(used.id);
}

export async function initialise() {
    const tracker = getSharedTracker();
    tracker.on("credentialsChanged", (details) => {
        transferLoginCredentials({
            fromEntry: details.entry,
            id: details.id,
            password: details.password,
            promptSave: true,
            timestamp: Date.now(),
            title: tracker.title,
            url: tracker.url,
            username: details.username
        });
    });
    await checkForLoginSaveAbility();
}

export function watchCredentialsOnTarget(loginTarget: LoginTarget): void {
    const tracker = getSharedTracker();
    tracker.registerConnection(loginTarget);
    watchLogin(
        loginTarget,
        (username, source) => {
            const connection = tracker.getConnection(loginTarget);
            connection.entry = source === "fill";
            connection.username = username;
        },
        (password, source) => {
            const connection = tracker.getConnection(loginTarget);
            connection.entry = source === "fill";
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
    usernameUpdate: (value: string, source: "keypress" | "fill") => void,
    passwordUpdate: (value: string, source: "keypress" | "fill") => void,
    onSubmit: () => void
) {
    target.on("valueChanged", (info) => {
        if (info.type === LoginTargetFeature.Username) {
            usernameUpdate(info.value, info.source);
        } else if (info.type === LoginTargetFeature.Password) {
            passwordUpdate(info.value, info.source);
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
