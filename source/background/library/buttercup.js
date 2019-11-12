import ChannelQueue, { TASK_TYPE_HIGH_PRIORITY } from "@buttercup/channel-queue";
import ms from "ms";
import { ArchiveManager, vendor as ButtercupVendor, Datasources } from "../../shared/library/buttercup.js";
import log from "../../shared/library/log.js";
import { dispatch } from "../redux/index.js";
import { setArchives, setUnlockedArchivesCount } from "../../shared/actions/archives.js";
import BrowserStorageInterface from "./BrowserStorageInterface.js";
import { authenticateWithoutToken, authenticateWithRefreshToken } from "./googleDrive.js";

let __archiveManager, __queue;

function attachArchiveManagerListeners(archiveManager) {
    archiveManager.on("sourcesUpdated", sources => {
        dispatch(
            setArchives(
                sources.map(source => ({
                    ...source,
                    // Compatibility:
                    title: source.name,
                    state: source.status
                }))
            )
        );
        dispatch(setUnlockedArchivesCount(archiveManager.unlockedSources.length));
    });
}

export function createArchiveManager() {
    const queue = getQueue();
    return queue.channel("archiveManager").enqueue(() => {
        const am = new ArchiveManager(new BrowserStorageInterface());
        attachArchiveManagerListeners(am);
        return am.rehydrate().then(() => {
            log.info("Rehydrated archive manager");
            __archiveManager = am;
            am.toggleAutoUpdating(true, ms("2m"));
            am.on("autoUpdateStop", () => {
                log.info("Completed auto-update");
            });
            log.info("Activated auto updating");
        });
    }, TASK_TYPE_HIGH_PRIORITY);
}

export function getArchiveManager() {
    return getQueue()
        .channel("archiveManager")
        .enqueue(() => __archiveManager);
}

export function getQueue() {
    if (!__queue) {
        __queue = new ChannelQueue();
    }
    return __queue;
}

export function registerAuthWatchers() {
    const { AuthManager } = Datasources;
    AuthManager.getSharedManager().registerHandler("googledrive", async datasource => {
        log.info("Google Drive datasource needs re-authentication");
        const { token: currentToken, refreshToken: currentRefreshToken } = datasource;
        if (!currentRefreshToken) {
            log.info("Datasource does not contain a refresh token: Performing full authorisation");
            const { accessToken, refreshToken } = await authenticateWithoutToken();
            datasource.updateTokens(accessToken, refreshToken);
            if (!refreshToken) {
                log.warn("Updating Google Drive datasource access token without refresh token");
            }
        } else {
            log.info("Datasource contains refresh token: Refreshing authorisation");
            const { accessToken } = await authenticateWithRefreshToken(currentToken, currentRefreshToken);
            datasource.updateTokens(accessToken, currentRefreshToken);
        }
        log.info("Google Drive datasource tokens updated");
    });
}
