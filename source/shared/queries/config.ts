import { Layerr } from "layerr";
import { sendBackgroundMessage } from "../services/messaging.js";
import { BackgroundMessageType, Configuration } from "../../popup/types.js";

export async function getConfig(): Promise<Configuration> {
    const resp = await sendBackgroundMessage({
        type: BackgroundMessageType.GetConfiguration
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed fetching application configuration");
    }
    return resp.config;
}

export async function setConfigValue<T extends keyof Configuration>(
    key: T,
    value: Configuration[T]
): Promise<Configuration> {
    const resp = await sendBackgroundMessage({
        configKey: key,
        configValue: value,
        type: BackgroundMessageType.SetConfigurationValue
    });
    if (resp.error) {
        throw new Layerr(resp.error, "Failed fetching application configuration");
    }
    return resp.config;
}
