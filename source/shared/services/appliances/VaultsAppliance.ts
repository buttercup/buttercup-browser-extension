import { SearchResult } from "buttercup";
import { Logger } from "../../library/log.js";
import { DataNetworkAppliance } from "./DataNetworkAppliance.js";
import { VaultSourceDescription } from "../../types.js";

interface VaultsApplianceDataset {
    pageEntries: Array<SearchResult>;
    popupEntries: Array<SearchResult>;
    vaults: Array<VaultSourceDescription>;
}

export class VaultsAppliance extends DataNetworkAppliance<VaultsApplianceDataset> {
    constructor(log: Logger) {
        super(
            "vaults-state",
            {
                pageEntries: [],
                popupEntries: [],
                vaults: []
            },
            log
        );
    }

    async initialise() {
        await super.initialise();
        if (!this.isBackground) {
            await this._syncFromBackground();
        }
    }
}
