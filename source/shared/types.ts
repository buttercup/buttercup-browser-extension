export interface BackgroundMessage {
    type: BackgroundMessageType;
    [key: string]: any;
}

export enum BackgroundMessageType {
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
