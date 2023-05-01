import { LoginTarget, LoginTargetFeature } from "@buttercup/locust";
import { onNavigate } from "on-navigate";
import { getSharedTracker } from "./LoginTracker.js";
import { transferLoginCredentials } from "./messaging.js";

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
            setTimeout(() => {
                // checkForLoginSaveAbility();
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
