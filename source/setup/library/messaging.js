import { Layerr } from "layerr";
import log from "../../shared/library/log.js";

export function addAttachments(sourceID, entryID, files) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "add-attachments", sourceID, entryID, files }, resp => {
            if (resp && resp.ok) {
                return resolve();
            }
            reject(resp.error ? new Error(resp.error) : new Error("Failed adding attachments"));
        });
    });
}

export function addNewEntry(sourceID, groupID, details) {
    const payload = {
        sourceID,
        groupID,
        ...details,
    };
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "add-new-entry", payload }, resp => {
            if (resp && resp.ok) {
                return resolve();
            }
            const error = new Layerr(
                {
                    info: { authFailure: resp.authFailure },
                },
                `Failed adding new entry: ${(resp && resp.error) || "Unknown error"}`
            );
            reject(error);
        });
    });
}

export function applyArchiveFacade(sourceID, facade) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "apply-vault-facade", sourceID, facade }, resp => {
            if (resp && resp.ok) {
                resolve();
            } else {
                reject(new Error(`Failed applying vault facade: ${(resp && resp.error) || "Unknown error"}`));
            }
        });
    });
}

export function authenticateGoogleDrive(useOpenPermissions = false) {
    chrome.runtime.sendMessage({ type: "authenticate-google-drive", useOpenPermissions });
}

export function changeSourcePassword(sourceID, oldPassword, newPassword, meta = {}) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
            { type: "change-vault-password", sourceID, oldPassword, newPassword, meta },
            resp => {
                if (resp && resp.ok) {
                    resolve(resp.facade);
                } else {
                    reject(new Error(`Failed changing vault password: ${(resp && resp.error) || "Unknown error"}`));
                }
            }
        );
    });
}

export function deleteAttachment(sourceID, entryID, attachmentID) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "delete-attachment", sourceID, entryID, attachmentID }, resp => {
            if (resp && resp.ok) {
                return resolve();
            }
            reject(resp.error ? new Error(resp.error) : new Error("Failed deleting attachment"));
        });
    });
}

export function disableDomainForSavePrompt(domain) {
    return new Promise(resolve => {
        chrome.runtime.sendMessage({ type: "disable-login-domain", domain }, () => {
            resolve();
        });
    });
}

export function getArchiveFacade(sourceID) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "create-vault-facade", sourceID }, resp => {
            if (resp && resp.ok) {
                resolve(resp.facade);
            } else {
                reject(new Error(`Failed getting vault facade: ${(resp && resp.error) || "Unknown error"}`));
            }
        });
    });
}

export function getArchivesGroupTree(sourceID) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "get-groups-tree", sourceID }, resp => {
            if (resp && resp.ok) {
                resolve(resp.groups);
            } else {
                reject(new Error(`Failed getting archive contents: ${(resp && resp.error) || "Unknown error"}`));
            }
        });
    });
}

export function getAttachmentData(sourceID, entryID, attachmentID) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "get-attachment", sourceID, entryID, attachmentID }, resp => {
            if (resp && resp.ok) {
                return resolve(resp.data);
            }
            reject(resp.error ? new Error(resp.error) : new Error("Failed getting attachment"));
        });
    });
}

export function getAttachmentDetails(sourceID, entryID, attachmentID) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "get-attachment-details", sourceID, entryID, attachmentID }, resp => {
            if (resp && resp.ok) {
                return resolve(resp.details);
            }
            reject(resp.error ? new Error(resp.error) : new Error("Failed getting attachment details"));
        });
    });
}

export function getDisabledSavePromptDomains() {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "get-disabled-save-prompt-domains" }, resp => {
            if (resp && resp.domains) {
                resolve(resp.domains);
            } else {
                reject(new Error("Failed getting disable domain prompts"));
            }
        });
    });
}

export function getLastUsedCredentials() {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "get-used-credentials", mode: "all" }, resp => {
            if (Array.isArray(resp.credentials)) {
                resolve(resp.credentials);
            } else {
                reject(new Error("Failed getting last login details"));
            }
        });
    });
}

export function lockArchive(sourceID) {
    log.info(`Sending request to background to lock archive source: ${sourceID}`);
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "lock-archive", sourceID }, response => {
            const { ok, error } = response;
            if (ok) {
                return resolve();
            }
            return reject(new Error(`Locking archive failed: ${error}`));
        });
    });
}

export function makeArchiveAdditionRequest(payload) {
    log.info("Making request to background for storing a new archive");
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "add-archive", payload }, response => {
            const { ok, error } = response;
            if (ok) {
                return resolve();
            }
            return reject(new Error(`Adding archive failed: ${error}`));
        });
    });
}

export function removeArchive(sourceID) {
    log.info(`Sending request to background for the removal of archive source: ${sourceID}`);
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "remove-archive", sourceID }, response => {
            const { ok, error } = response;
            if (ok) {
                return resolve();
            }
            return reject(new Error(`Adding removal failed: ${error}`));
        });
    });
}

export function removeDisabledDomainForSavePrompt(domain) {
    return new Promise(resolve => {
        chrome.runtime.sendMessage({ type: "remove-disabled-login-domain", domain }, () => {
            resolve();
        });
    });
}

export function removeSavedCredentials(id) {
    chrome.runtime.sendMessage({ type: "remove-saved-credentials", id });
}

export function unlockArchive(sourceID, masterPassword) {
    log.info(`Making request to background to unlock archive source: ${sourceID}`);
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "unlock-archive", sourceID, masterPassword }, response => {
            const { ok, error, hush = false } = response;
            if (ok) {
                return resolve();
            }
            return reject(
                new Layerr(
                    {
                        info: { hush },
                    },
                    `Unlocking archive source (${sourceID}) failed: ${error}`
                )
            );
        });
    });
}
