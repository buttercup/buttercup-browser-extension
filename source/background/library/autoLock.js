import { getState } from "../redux/index.js";
import { getConfigKey, getUserActivity } from "../../shared/selectors/app.js";
import { getUnlockedSourcesCount, lockSources } from "./archives.js";
import { getVaultManager } from "./buttercup.js";
import { clearSearchResults } from "./messaging.js";

export function watchForSourcesAutoLock() {
    const lockVaults = () => {
        const state = getState();
        const autoLockTime = getConfigKey(state, "autoLockVaults");
        if (autoLockTime === "off") {
            return;
        }
        const userActivity = getUserActivity(state);
        const num = parseInt(autoLockTime, 10);
        let x = Date.now() - userActivity;
        if (x > num) {
            getUnlockedSourcesCount().then(count => {
                if (count > 0) {
                    clearSearchResults();
                    lockSources();
                }
            });
        }
    };
    setInterval(lockVaults, 1000);
}
