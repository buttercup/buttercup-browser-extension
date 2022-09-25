import { VaultType } from "../types.js";
import VAULT_TYPE_IMAGE_DROPBOX from "../../../resources/providers/dropbox-256.png";
import VAULT_TYPE_IMAGE_GOOGLEDRIVE from "../../../resources/providers/googledrive-256.png";
import VAULT_TYPE_IMAGE_LOCALFILE from "../../../resources/providers/local-256.png";
import VAULT_TYPE_IMAGE_WEBDAV from "../../../resources/providers/webdav-256.png";

interface VaultTypeDescription {
    disabled: boolean;
    image: any;
    invertOnDarkMode: boolean;
}

export const VAULT_TYPES: Record<VaultType, VaultTypeDescription> = {
    [VaultType.Dropbox]: {
        image: VAULT_TYPE_IMAGE_DROPBOX,
        invertOnDarkMode: false,
        disabled: false
    },
    [VaultType.GoogleDrive]: {
        image: VAULT_TYPE_IMAGE_GOOGLEDRIVE,
        invertOnDarkMode: false,
        disabled: false
    },
    [VaultType.WebDAV]: {
        image: VAULT_TYPE_IMAGE_WEBDAV,
        invertOnDarkMode: true,
        disabled: false
    },
    [VaultType.LocalFile]: {
        image: VAULT_TYPE_IMAGE_LOCALFILE,
        invertOnDarkMode: false,
        disabled: false
    }
};
