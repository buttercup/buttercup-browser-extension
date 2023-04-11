import { EntryID, SearchResult, VaultFormatID, VaultSourceID, VaultSourceStatus } from "buttercup";
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
    url?: string;
}

export enum BackgroundMessageType {
    AuthenticateDesktopConnection = "authenticateDesktopConnection",
    CheckDesktopConnection = "checkDesktopConnection",
    ClearDesktopAuthentication = "clearDesktopAuthentication",
    InitiateDesktopConnection = "initiateDesktopConnection",
    GetDesktopVaultSources = "getDesktopVaultSources",
    GetOTPs = "getOTPs",
    SearchEntriesByTerm = "searchEntriesByTerm",
    SearchEntriesByURL = "searchEntriesByURL"
}

export interface BackgroundResponse {
    available?: boolean;
    error?: Error;
    otps?: Array<OTP>;
    searchResults?: Array<SearchResult>;
    vaultSources?: Array<VaultSourceDescription>;
}

type ChildElement = ReactChild | ReactChildren | false | null;
export type ChildElements = ChildElement | Array<ChildElement>;

export interface ElementRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface OTP {
    entryID: EntryID;
    entryProperty: string;
    entryTitle: string;
    loginURL: string | null;
    otpTitle?: string;
    otpURL: string;
    sourceID: VaultSourceID;
}

export interface TabEvent {
    formID?: string;
    inputDetails?: {
        otp?: string;
        password?: string;
        username?: string;
    };
    inputPosition?: ElementRect;
    source?: MessageEventSource;
    sourceURL?: string;
    type: TabEventType;
}

export enum TabEventType {
    GetFrameID = "getFrameID",
    InputDetails = "inputDetails",
    OpenPopupDialog = "openPopupDialog"
}

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
