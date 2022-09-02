import ChannelQueue, { TASK_TYPE_HIGH_PRIORITY } from "@buttercup/channel-queue";
import debounce from "debounce";
import ms from "ms";
import { Layerr } from "layerr";
import { DatasourceAuthManager, VaultManager, VaultSource } from "../../shared/library/buttercup.js";
import log from "../../shared/library/log.js";
import { dispatch } from "../redux/index.js";
import { setArchives, setArchivesCount, setUnlockedArchivesCount } from "../../shared/actions/archives.js";
import BrowserStorageInterface, { getNonSyncStorage, getSyncStorage } from "./BrowserStorageInterface.js";
import { authenticateWithoutToken, authenticateWithRefreshToken } from "./googleDrive.js";
import { updateSearch } from "./search.js";
import { updateFacades } from "./facades.js";

const ERR_REFRESH_FAILED = "err/refresh/failed";

let __vaultManager, __queue, __updateSearch;

function attachArchiveManagerListeners(vaultManager) {
    if (!__updateSearch) {
        __updateSearch = debounce(
            () => {
                updateSearch(vaultManager.unlockedSources.map(src => src.vault));
            },
            250,
            false // immediate
        );
    }
    vaultManager.on("sourcesUpdated", () => {
        dispatch(setArchives(vaultManager.sources.map(source => describeSource(source))));
        dispatch(setArchivesCount(vaultManager.sources.length));
        dispatch(setUnlockedArchivesCount(vaultManager.unlockedSources.length));
        updateFacades()
            .then(() => {
                __updateSearch();
            })
            .catch(err => {
                log.error("Failed updating facades after sources updated");
                console.error(err);
            });
    });
}

export function createArchiveManager() {
    const queue = getQueue();
    return queue.channel("archiveManager").enqueue(() => {
        const vm = new VaultManager({
            autoUpdate: true,
            autoUpdateDelay: ms("2m"),
            cacheStorage: new BrowserStorageInterface(getNonSyncStorage()),
            sourceStorage: new BrowserStorageInterface(getSyncStorage())
        });
        attachArchiveManagerListeners(vm);
        vm.initialise();
        return vm.rehydrate().then(() => {
            log.info("Rehydrated archive manager");
            __vaultManager = vm;
            vm.on("autoUpdateFailed", ({ source }) => {
                log.error(`Auto-update failed for source: ${source.id} (${source.name})`);
            });
            vm.on("autoUpdateStop", () => {
                log.info("Completed auto-update");
            });
        });
    }, TASK_TYPE_HIGH_PRIORITY);
}

function describeSource(source) {
    let attachments = false;
    if (source.status === VaultSource.STATUS_UNLOCKED) {
        attachments = source._datasource.supportsAttachments();
    }
    return {
        id: source.id,
        name: source.name,
        state: source.status,
        type: source.type,
        attachments
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
            try {
                const { accessToken } = await authenticateWithRefreshToken(currentToken, currentRefreshToken);
                datasource.updateTokens(accessToken, currentRefreshToken);
            } catch (err) {
                const { code, status } = Layerr.info(err);
                if (code === ERR_REFRESH_FAILED && status === 400) {
                    // Start re-authentication procedure
                    log.info("Refresh failed, performing full authorisation");
                    const { accessToken, refreshToken } = await authenticateWithoutToken();
                    datasource.updateTokens(accessToken, refreshToken);
                    if (!refreshToken) {
                        log.warn("Updating Google Drive datasource access token without refresh token");
                    }
                    return;
                }
                throw err;
            }
        }
        log.info("Google Drive datasource tokens updated");
    });
}
