export interface AddVaultPayload {
    createNew: boolean;
    dropboxToken?: string;
    masterPassword: string;
    name: string;
    type: VaultType;
    vaultPath: string;
}

export interface BackgroundMessage {
    type: BackgroundMessageType;
    [key: string]: any;
}

export enum BackgroundMessageType {
    AddVault = "addVault",
    AuthenticateProvider = "authenticateProvider"
}

export interface BackgroundResponse {
    error?: Error;
    [key: string]: any;
}

export enum VaultType {
    Dropbox = "dropbox",
    GoogleDrive = "googledrive",
    LocalFile = "localfile",
    WebDAV = "webdav"
}
