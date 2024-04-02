import { getSyncValue, setSyncValue } from "./storage.js";
import { Configuration, InputButtonType, SyncStorageItem } from "../types.js";

const DEFAULTS: Configuration = {
    entryIcons: true,
    inputButtonDefault: InputButtonType.LargeButton,
    saveNewLogins: true,
    theme: "light",
    useSystemTheme: true
};

let __lastConfig: Configuration = null;

export function getConfig(): Configuration {
    if (!__lastConfig) {
        throw new Error("No configuration available");
    }
    return __lastConfig;
}

export async function initialise() {
    __lastConfig = await updateConfigWithDefaults();
}

export async function updateConfigValue<T extends keyof Configuration>(key: T, value: Configuration[T]): Promise<void> {
    const configRaw = await getSyncValue(SyncStorageItem.Configuration);
    const config = JSON.parse(configRaw);
    config[key] = value;
    __lastConfig = config;
    await setSyncValue(SyncStorageItem.Configuration, JSON.stringify(config));
}

async function updateConfigWithDefaults(): Promise<Configuration> {
    let configRaw = await getSyncValue(SyncStorageItem.Configuration);
    const config = configRaw ? JSON.parse(configRaw) : { ...DEFAULTS };
    for (const key in DEFAULTS) {
        if (typeof config[key] === "undefined") {
            config[key] = DEFAULTS[key];
        }
    }
    await setSyncValue(SyncStorageItem.Configuration, JSON.stringify(config));
    return config;
}
