import path from "path";
import { getIconFilename } from "@buttercup/iconographer";
import extractDomain from "extract-domain";
import { getExtensionURL } from "./extension.js";

export function getIconForURL(url) {
    const domain = extractDomain(url);
    const filepath = getIconFilename(domain);
    const filename = path.basename(filepath);
    return getExtensionURL(`site-icons/images/${filename}`);
}
