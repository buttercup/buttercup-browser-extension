import { authenticate as authenticateDropbox } from "../services/dropbox.js";
import { VaultType } from "../types.js";

export async function routeProviderAuthentication(datasource: VaultType): Promise<{
    code?: string;
    token?: string;
}> {
    if (datasource === VaultType.Dropbox) {
        const token = await authenticateDropbox();
        return { token };
    }
    throw new Error(`Unknown datasource type: ${datasource}`);
}
