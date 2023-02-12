import { VaultFormatID, VaultSourceID, VaultSourceStatus } from "buttercup";
import { ReactChild, ReactChildren } from "react";

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

type ChildElement = ReactChild | ReactChildren | false | null;
export type ChildElements = ChildElement | Array<ChildElement>;

export interface VaultSourceDescription {
    id: VaultSourceID;
    name: string;
    state: VaultSourceStatus;
    type: VaultType;
    order: number;
    format?: VaultFormatID;
}

export enum VaultType {
    Dropbox = "dropbox",
    GoogleDrive = "googledrive",
    LocalFile = "localfile",
    WebDAV = "webdav"
}
