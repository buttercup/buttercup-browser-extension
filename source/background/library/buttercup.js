import ChannelQueue, { TASK_TYPE_HIGH_PRIORITY } from "@buttercup/channel-queue";
import ms from "ms";
import { DatasourceAuthManager, VaultManager } from "../../shared/library/buttercup.js";
import log from "../../shared/library/log.js";
import { dispatch } from "../redux/index.js";
import { setArchives, setArchivesCount, setUnlockedArchivesCount } from "../../shared/actions/archives.js";
import BrowserStorageInterface from "./BrowserStorageInterface.js";
import { authenticateWithoutToken, authenticateWithRefreshToken } from "./googleDrive.js";

let __vaultManager, __queue;

function attachArchiveManagerListeners(vaultManager) {
    vaultManager.on("sourcesUpdated", () => {
        dispatch(setArchives(vaultManager.sources.map(source => describeSource(source))));
        dispatch(setArchivesCount(vaultManager.sources.length));
        dispatch(setUnlockedArchivesCount(vaultManager.unlockedSources.length));
    });
}

export function createArchiveManager() {
    const queue = getQueue();
    return queue.channel("archiveManager").enqueue(() => {
        const vm = new VaultManager(new BrowserStorageInterface());
        attachArchiveManagerListeners(vm);
        return vm.rehydrate().then(() => {
            log.info("Rehydrated archive manager");
            __vaultManager = vm;
            vm.toggleAutoUpdating(true, ms("2m"));
            vm.on("autoUpdateStop", () => {
                log.info("Completed auto-update");
            });
            log.info("Activated auto updating");
        });
    }, TASK_TYPE_HIGH_PRIORITY);
}

function describeSource(source) {
    return {
        id: source.id,
        title: source.name,
        state: source.state,
        type: source.type
    };
}

export function getVaultManager() {
    return getQueue()
        .channel("archiveManager")
        .enqueue(() => __vaultManager);
}

export function getQueue() {
    if (!__queue) {
        __queue = new ChannelQueue();
    }
    return __queue;
}

export function registerAuthWatchers() {
    DatasourceAuthManager.getSharedManager().registerHandler("googledrive", async datasource => {
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
