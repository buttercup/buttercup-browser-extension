import VAULT_TYPE_IMAGE_DROPBOX from "../../../resources/providers/dropbox-256.png";
import VAULT_TYPE_IMAGE_GOOGLEDRIVE from "../../../resources/providers/googledrive-256.png";
import VAULT_TYPE_IMAGE_LOCALFILE from "../../../resources/providers/local-256.png";
import VAULT_TYPE_IMAGE_WEBDAV from "../../../resources/providers/webdav-256.png";

export const VAULT_TYPES = {
    dropbox: {
        title: "Dropbox",
        image: VAULT_TYPE_IMAGE_DROPBOX,
        invertOnDarkMode: false
    },
    googledrive: {
        type: "googledrive",
        title: "Google Drive",
        image: VAULT_TYPE_IMAGE_GOOGLEDRIVE,
        invertOnDarkMode: false
    },
    webdav: {
        type: "webdav",
        title: "WebDAV",
        image: VAULT_TYPE_IMAGE_WEBDAV,
        invertOnDarkMode: true
    },
    localfile: {
        type: "localfile",
        title: "Local File",
        image: VAULT_TYPE_IMAGE_LOCALFILE,
        invertOnDarkMode: false
    }
};
