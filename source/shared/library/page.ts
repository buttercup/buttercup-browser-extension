import { createNewTab, getExtensionURL } from "./extension.js";

export function openAddVaultPage() {
    createNewTab(getExtensionURL("/full.html#/add-vault"));
}
