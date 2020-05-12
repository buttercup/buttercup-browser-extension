import path from "path";
import { getIconFilename } from "@buttercup/iconographer";
import extractDomain from "extract-domain";
import { getExtensionURL } from "./extension.js";

export const VAULT_TYPES = [
    {
        type: "mybuttercup",
        title: "My Buttercup",
        image: require("../../../resources/providers/mybuttercup-256.png"),
        invertOnDarkMode: false
    },
    {
        type: "dropbox",
        title: "Dropbox",
        image: require("../../../resources/providers/dropbox-256.png"),
        invertOnDarkMode: true
    },
    {
        type: "googledrive",
        title: "Google Drive",
        image: require("../../../resources/providers/googledrive-256.png"),
        invertOnDarkMode: false
    },
    {
        type: "webdav",
        title: "WebDAV",
        image: require("../../../resources/providers/webdav-256.png"),
        invertOnDarkMode: true
    },
    {
        type: "localfile",
        title: "Local File",
        image: require("../../../resources/providers/chip.svg"),
        invertOnDarkMode: true
    }
];

export function getIconForURL(url) {
    // Extract-domain extracts base domain
    const domain = extractDomain(url);
    const filepath = getIconFilename(domain);
    const filename = path.basename(filepath);
    return getExtensionURL(`site-icons/images/${filename}`);
}
