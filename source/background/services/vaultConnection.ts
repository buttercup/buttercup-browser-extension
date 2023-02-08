import { Credentials, VaultSourceID } from "buttercup";
import { Layerr } from "layerr";
import { AddVaultPayload, VaultType } from "../types.js";
import { addVaultSource, removeSource, unlockAndCreate, unlockSource } from "./buttercup.js";
import { log } from "./log.js";

export async function connectVault(payload: AddVaultPayload): Promise<VaultSourceID> {
    const { createNew, masterPassword, name } = payload;
    log(`connect vault: ${name} (new: ${createNew})`);
    const [rawCredentials, bcupType] = generateSourceCredentials(payload);
    const sourceCredsStr = await rawCredentials.toSecureString();
    // Add the source
    const sourceID = await addVaultSource(name, bcupType, sourceCredsStr);
    // Attempt to unlock
    try {
        if (createNew) {
            await unlockAndCreate(sourceID, masterPassword);
        } else {
            await unlockSource(sourceID, masterPassword);
        }
    } catch (err) {
        await removeSource(sourceID);
        throw new Layerr(
            {
                cause: err,
                info: {
                    i18n: "unlock-failure"
                }
            },
            "Failed unlocking source"
        );
    }
    // Return successfully
    return sourceID;
}

function generateSourceCredentials(payload: AddVaultPayload): [Credentials, string] {
    switch (payload.type) {
        case VaultType.Dropbox:
            return [
                Credentials.fromDatasource(
                    {
                        type: "dropbox",
                        token: payload.dropboxToken,
                        path: payload.vaultPath
                    },
                    payload.masterPassword
                ),
                "dropbox"
            ];
        default:
            throw new Layerr(
                {
                    info: {
                        i18n: "bad-vault-type"
                    }
                },
                `Unrecognised vault type: ${payload.type}`
            );
    }
}
