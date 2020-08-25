import { StorageInterface } from "@buttercup/iconographer";

const MAX_ICON_AGE = 1000 * 60 * 60 * 24 * 30; // 30 days

function getTimestamp() {
    const date = new Date();
    return date.getTime();
}

export default class IconBrowserStorageInterface extends StorageInterface {
    deleteIcon(iconKey) {
        const storedKey = `buttercup:icon:${iconKey}`;
        return new Promise(resolve => {
            chrome.storage.local.remove(storedKey, resolve);
        });
    }

    encodeIconForStorage(iconData) {
        const reader = new window.FileReader();
        reader.readAsDataURL(iconData);
        return new Promise(resolve => {
            reader.onloadend = () => {
                resolve(reader.result);
            };
        });
    }

    retrieveIcon(iconKey) {
        const storedKey = `buttercup:icon:${iconKey}`;
        return new Promise(resolve => {
            chrome.storage.local.get(storedKey, result => {
                const item = result[storedKey];
                if (item) {
                    const { ts, icon } = JSON.parse(item);
                    if (getTimestamp() - ts <= MAX_ICON_AGE) {
                        return resolve(icon);
                    }
                }
                return resolve(null);
            });
        });
    }

    storeIcon(iconKey, iconData) {
        const storedKey = `buttercup:icon:${iconKey}`;
        return new Promise(resolve => {
            chrome.storage.local.set(
                {
                    [storedKey]: JSON.stringify({
                        ts: getTimestamp(),
                        icon: iconData,
                    }),
                },
                resolve
            );
        });
    }
}
