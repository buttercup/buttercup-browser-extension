import md2json from "md-2-json";
import marked from "marked";
import { getExtensionURL } from "../../shared/library/extension.js";
import { dispatch } from "../redux/index.js";
import { setReleaseNotes } from "../actions/releaseNotes.js";

function extractVersionFromText(txt) {
    const match = txt.match(/(\d+\.\d+\.\d+([+-][^\s]+)*)/);
    return match ? match[1] : "";
}

export function fetchReleaseNotes() {
    return processReleaseNotes().then(html => {
        setTimeout(() => {
            dispatch(setReleaseNotes(forceTargetBlank(html)));
        }, 0);
    });
}

function forceTargetBlank(html) {
    return html.replace(/<a href=/g, '<a target="_blank" href=');
}

function processReleaseNotes() {
    const changelogURL = getExtensionURL("/CHANGELOG.md");
    const version = __VERSION__;
    return fetch(changelogURL)
        .then(res => res.text())
        .then(changelog => {
            const parts = md2json.parse(changelog);
            const [rootKey] = Object.keys(parts);
            const versionIndex = parts[rootKey];
            const versionMatrix = Object.keys(versionIndex).reduce(
                (matrix, rawVer) => ({
                    ...matrix,
                    [extractVersionFromText(rawVer)]: rawVer
                }),
                {}
            );
            const matchedRawVersion = versionMatrix[version];
            if (!matchedRawVersion) {
                throw new Error(`Failed finding changelog version for: ${version}`);
            }
            const item = versionIndex[matchedRawVersion];
            if (!item) {
                throw new Error(`Failed extracting changelog item for: ${version}`);
            }
            const { raw: md } = item;
            return marked(md);
        })
        .catch(err => {
            console.error("Failed fetching changelog", err);
        });
}
