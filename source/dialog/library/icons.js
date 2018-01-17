const { Iconographer, setDataFetcher, setTextFetcher } = require("@buttercup/iconographer");
import IconLocalStorageInterface from "./IconLocalStorageInterface.js";

let __ic;

export function getIconForURL(url) {
    const iconographer = getSharedInstance();
    return iconographer
        .getIconForURL(url)
        .then(icon => {
            if (icon) {
                return icon;
            }
            return iconographer.processIconForURL(url);
        })
        .then(retrieved => {
            if (retrieved) {
                return iconographer.getIconForURL(url);
            }
            return null;
        })
        .catch(err => {
            console.error(`Failed retrieving icon for URL (${url})`, err);
            return null;
        });
}

function getSharedInstance() {
    if (!__ic) {
        __ic = new Iconographer();
        __ic.storageInterface = new IconLocalStorageInterface();
        setTextFetcher(url => {
            return window.fetch(url).then(res => res.text());
        });
        setDataFetcher(url => {
            return window.fetch(url).then(res => res.blob());
        });
    }
    return __ic;
}
