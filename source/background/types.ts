export * from "../shared/types.js";

export enum LocalStorageItem {
    APIClientID = "bcup:api:clientID",
    APIPrivateKey = "bcup:api:privateKey",
    APIPublicKey = "bcup:api:publicKey",
    APIServerPublicKey = "bcup:api:serverPublicKey"
}

export enum SyncStorageItem {
    Configuration = "bcup:configuration",
    DisabledDomains = "bcup:disabledDomains"
}
