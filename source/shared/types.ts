import {
    EntryID,
    EntryType,
    GroupID,
    SearchResult,
    VaultFacade,
    VaultFormatID,
    VaultSourceID,
    VaultSourceStatus
} from "buttercup";
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
    entryID?: EntryID;
    entryProperties?: Record<string, string>;
    entryType?: EntryType;
    groupID?: GroupID;
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
    GetDesktopVaultsTree = "getDesktopVaultsTree",
    GetDisabledDomains = "getDisabledDomains",
    GetOTPs = "getOTPs",
    GetSavedCredentials = "getCredentials",
    GetSavedCredentialsForID = "getCredentialsForID",
    PromptLockSource = "promptLockSource",
    PromptUnlockSource = "promptUnlockSource",
    ResetSettings = "resetSettings",
    SaveCredentialsToVault = "saveCredentialsToVault",
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
    entryID?: EntryID | null;
    error?: Error;
    locked?: boolean;
    otps?: Array<OTP>;
    searchResults?: Array<SearchResult>;
    vaultSources?: Array<VaultSourceDescription>;
    vaultsTree?: VaultsTree;
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

export interface SavedCredentials extends UsedCredentials {
    entryID?: EntryID;
    groupID: GroupID;
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
    inputType?: InputType;
    source?: MessageEventSource;
    sourceURL?: string;
    type: TabEventType;
}

export enum TabEventType {
    CloseSaveDialog = "closeSaveDialog",
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

export interface VaultsTree {
    [key: string]: VaultFacade;
}

export enum VaultType {
    Dropbox = "dropbox",
    File = "file",
    GoogleDrive = "googledrive",
    WebDAV = "webdav"
}
