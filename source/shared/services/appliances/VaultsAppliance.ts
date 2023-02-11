import { SearchResult } from "buttercup";
import { VaultSourceDescription } from "../../types.js";
import { DataNetworkAppliance } from "./DataNetworkAppliance.js";

interface VaultsApplianceDataset {
    pageEntries: Array<SearchResult>;
    popupEntries: Array<SearchResult>;
    vaults: Array<VaultSourceDescription>;
}

export class VaultsAppliance extends DataNetworkAppliance<VaultsApplianceDataset> {
    constructor() {
        super({
            pageEntries: [],
            popupEntries: [],
            vaults: []
        });
    }

    async initialise() {
        await super.initialise();
        if (!this.isPrimary) {
            // Fetch data from primary
            return new Promise<void>(async (resolve, reject) => {
                let timeout = setTimeout(() => {
                    reject(new Error("Failed initialising vault appliance: No data received from primary"));
                }, 5000);
                this.once("fetchedAll", () => {
                    resolve();
                    clearTimeout(timeout);
                });
                await this._syncFromPrimary();
            });
        }
    }
}
