import path from "path";
import { getExtensionURL } from "./extension.js";

import VAULT_TYPE_IMAGE_DROPBOX from "../../../resources/providers/dropbox-256.png";
import VAULT_TYPE_IMAGE_GOOGLEDRIVE from "../../../resources/providers/googledrive-256.png";
import VAULT_TYPE_IMAGE_LOCALFILE from "../../../resources/providers/chip.svg";
import VAULT_TYPE_IMAGE_MYBUTTERCUP from "../../../resources/providers/mybuttercup-256.png";
import VAULT_TYPE_IMAGE_WEBDAV from "../../../resources/providers/webdav-256.png";

export const DATASOURCE_TYPES = ["mybuttercup", "dropbox", "googledrive", "webdav", "localfile"];
export const VAULT_TYPES = [
    {
        type: "mybuttercup",
        title: "My Buttercup",
        image: VAULT_TYPE_IMAGE_MYBUTTERCUP,
        invertOnDarkMode: false
    },
    {
        type: "dropbox",
        title: "Dropbox",
        image: VAULT_TYPE_IMAGE_DROPBOX,
        invertOnDarkMode: true
    },
    {
        type: "googledrive",
        title: "Google Drive",
        image: VAULT_TYPE_IMAGE_GOOGLEDRIVE,
        invertOnDarkMode: false
    },
    {
        type: "webdav",
        title: "WebDAV",
        image: VAULT_TYPE_IMAGE_WEBDAV,
        invertOnDarkMode: true
    },
    {
        type: "localfile",
        title: "Local File",
        image: VAULT_TYPE_IMAGE_LOCALFILE,
        invertOnDarkMode: true
    }
];
