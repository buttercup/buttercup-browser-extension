import { StorageInterface } from "@buttercup/iconographer";

const MAX_ICON_AGE = 1000 * 60 * 60 * 24 * 30; // 30 days

function getLocalStorageKeys() {
    const keys = [];
    for (let i = 0; i < window.localStorage.length; i += 1) {
        keys.push(window.localStorage.key(i));
    }
    return keys;
}

function getTimestamp() {
    const date = new Date();
    return date.getTime();
}

export default class IconLocalStorageInterface extends StorageInterface {
    deleteIcon(iconKey) {
        const storedKey = `buttercup:icon:${iconKey}`;
        window.localStorage.removeItem(storedKey);
        return Promise.resolve();
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

    getIconKeys() {
        const prefix = /^buttercup:icon:/;
        return getLocalStorageKeys()
            .filter(key => prefix.test(key))
            .map(key => key.replace(prefix, ""));
    }

    retrieveIcon(iconKey) {
        const storedKey = `buttercup:icon:${iconKey}`;
        const item = window.localStorage.getItem(storedKey);
        if (item) {
            const { ts, icon } = JSON.parse(item);
            if (getTimestamp() - ts <= MAX_ICON_AGE) {
                return Promise.resolve(icon);
            }
        }
        return Promise.resolve(null);
    }

    storeIcon(iconKey, iconData) {
        const storedKey = `buttercup:icon:${iconKey}`;
        window.localStorage.setItem(
            storedKey,
            JSON.stringify({
                ts: getTimestamp(),
                icon: iconData
            })
        );
        return Promise.resolve();
    }
}
