import path from "path";
import { getIconFilename } from "@buttercup/iconographer";
import extractDomain from "extract-domain";
import { getExtensionURL } from "./extension.js";

import MyButtercupIcon from "../../../resources/providers/mybuttercup-256.png";
import DropboxIcon from "../../../resources/providers/dropbox-256.png";
import GoogleDriveIcon from "../../../resources/providers/googledrive-256.png";
import WebDavIcon from "../../../resources/providers/webdav-256.png";
import ChipIcon from "../../../resources/providers/chip.svg";

export const DATASOURCE_TYPES = ["mybuttercup", "dropbox", "googledrive", "webdav", "localfile"];
export const VAULT_TYPES = [
    {
        type: "mybuttercup",
        title: "My Buttercup",
        image: MyButtercupIcon,
        invertOnDarkMode: false,
    },
    {
        type: "dropbox",
        title: "Dropbox",
        image: DropboxIcon,
        invertOnDarkMode: true,
    },
    {
        type: "googledrive",
        title: "Google Drive",
        image: GoogleDriveIcon,
        invertOnDarkMode: false,
    },
    {
        type: "webdav",
        title: "WebDAV",
        image: WebDavIcon,
        invertOnDarkMode: true,
    },
    {
        type: "localfile",
        title: "Local File",
        image: ChipIcon,
        invertOnDarkMode: true,
    },
];

export function getIconForURL(url) {
    // Extract-domain extracts base domain
    const domain = extractDomain(url);
    const filepath = getIconFilename(domain);
    const filename = path.basename(filepath);
    return getExtensionURL(`site-icons/images/${filename}`);
}
