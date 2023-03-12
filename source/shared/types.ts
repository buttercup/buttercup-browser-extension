import { SearchResult, VaultFormatID, VaultSourceID, VaultSourceStatus } from "buttercup";
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
    code?: string;
    searchTerm?: string;
    type: BackgroundMessageType;
}

export enum BackgroundMessageType {
    AuthenticateDesktopConnection = "authenticateDesktopConnection",
    CheckDesktopConnection = "checkDesktopConnection",
    InitiateDesktopConnection = "initiateDesktopConnection",
    GetDesktopVaultSources = "getDesktopVaultSources",
    SearchEntriesByTerm = "searchEntriesByTerm"
}

export interface BackgroundResponse {
    available?: boolean;
    error?: Error;
    searchResults?: Array<SearchResult>;
    vaultSources?: Array<VaultSourceDescription>;
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
    File = "file",
    GoogleDrive = "googledrive",
    WebDAV = "webdav"
}
