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
            const md = scrapeMarkdownForSection(changelog, version);
            return marked(md);
        })
        .catch(err => {
            console.error("Failed fetching changelog", err);
        });
}

function scrapeMarkdownForSection(markdown, version) {
    const lines = markdown.split(/\n/g);
    const sectionLines = [];
    let inSection = false;
    for (let i = 0; i < lines.length; i += 1) {
        const match = /^##.+v(\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?)/.exec(lines[i]);
        if (match) {
            if (inSection) {
                break;
            } else if (match[1] === version) {
                inSection = true;
                // Uncomment the following to include the version:
                // sectionLines.push(lines[i]);
            }
            continue;
        }
        if (inSection) {
            sectionLines.push(lines[i]);
        }
    }
    return sectionLines.join("\n");
}
