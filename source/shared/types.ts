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
    configKey?: keyof Configuration;
    configValue?: any;
    credentials?: UsedCredentials;
    credentialsID?: string;
    searchTerm?: string;
    sourceID?: VaultSourceID;
    type: BackgroundMessageType;
    url?: string;
}

export enum BackgroundMessageType {
    AuthenticateDesktopConnection = "authenticateDesktopConnection",
    CheckDesktopConnection = "checkDesktopConnection",
    ClearDesktopAuthentication = "clearDesktopAuthentication",
    InitiateDesktopConnection = "initiateDesktopConnection",
    GetConfiguration = "getConfiguration",
    GetDesktopVaultSources = "getDesktopVaultSources",
    GetDisabledDomains = "getDisabledDomains",
    GetOTPs = "getOTPs",
    GetSavedCredentials = "getCredentials",
    GetSavedCredentialsForID = "getCredentialsForID",
    PromptLockSource = "promptLockSource",
    PromptUnlockSource = "promptUnlockSource",
    SaveUsedCredentials = "saveUsedCredentials",
    SearchEntriesByTerm = "searchEntriesByTerm",
    SearchEntriesByURL = "searchEntriesByURL",
    SetConfigurationValue = "setConfigurationValue"
}

export interface BackgroundResponse {
    available?: boolean;
    config?: Configuration;
    credentials?: Array<UsedCredentials>;
    domains?: Array<string>;
    error?: Error;
    locked?: boolean;
    otps?: Array<OTP>;
    searchResults?: Array<SearchResult>;
    vaultSources?: Array<VaultSourceDescription>;
}

type ChildElement = ReactChild | ReactChildren | false | null;
export type ChildElements = ChildElement | Array<ChildElement>;

export interface Configuration {
    entryIcons: boolean;
    saveNewLogins: boolean;
    theme: "light" | "dark";
    useSystemTheme: boolean;
}

export interface ElementRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export enum InputType {
    OTP = "otp",
    UserPassword = "user-password"
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

export enum PopupPage {
    Entries = "entries",
    OTPs = "otps",
    Settings = "settings",
    Vaults = "vaults"
}

export interface TabEvent {
    formID?: string;
    inputDetails?: {
        otp?: string;
        password?: string;
        username?: string;
    };
    inputPosition?: ElementRect;
    inputType?: InputType;
    source?: MessageEventSource;
    sourceURL?: string;
    type: TabEventType;
}

export enum TabEventType {
    GetFrameID = "getFrameID",
    InputDetails = "inputDetails",
    OpenPopupDialog = "openPopupDialog"
}

export interface UsedCredentials {
    fromEntry: boolean;
    id: string;
    password: string;
    timestamp: number;
    title: string;
    url: string;
    username: string;
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
