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
    autoLogin?: boolean;
    code?: string;
    configKey?: keyof Configuration;
    configValue?: any;
    count?: number;
    credentials?: UsedCredentials;
    credentialsID?: string;
    domains?: Array<string>;
    entry?: SearchResult;
    entryID?: EntryID;
    entryProperties?: Record<string, string>;
    entryType?: EntryType;
    excludeSaved?: boolean;
    groupID?: GroupID;
    notification?: string;
    searchTerm?: string;
    sourceID?: VaultSourceID;
    text?: string;
    type: BackgroundMessageType;
    url?: string;
}

export enum BackgroundMessageType {
    AuthenticateDesktopConnection = "authenticateDesktopConnection",
    CheckDesktopConnection = "checkDesktopConnection",
    ClearDesktopAuthentication = "clearDesktopAuthentication",
    ClearSavedCredentials = "clearSavedCredentials",
    ClearSavedCredentialsPrompt = "clearSavedCredentialsPrompt",
    DisableSavePromptForCredentials = "disableSavePromptForCredentials",
    DeleteDisabledDomains = "deleteDisabledDomains",
    InitiateDesktopConnection = "initiateDesktopConnection",
    GetAutoLoginForTab = "getTabAutoLogin",
    GetConfiguration = "getConfiguration",
    GetDesktopVaultSources = "getDesktopVaultSources",
    GetDesktopVaultsTree = "getDesktopVaultsTree",
    GetDisabledDomains = "getDisabledDomains",
    GetLastSavedCredentials = "getLastSavedCredentials",
    GetOTPs = "getOTPs",
    GetRecentEntries = "getRecentEntries",
    GetSavedCredentials = "getCredentials",
    GetSavedCredentialsForID = "getCredentialsForID",
    MarkNotificationRead = "markNotificationRead",
    OpenEntryPage = "openEntryPage",
    OpenSaveCredentialsPage = "openSaveCredentials",
    PromptLockSource = "promptLockSource",
    PromptUnlockSource = "promptUnlockSource",
    ResetSettings = "resetSettings",
    SaveCredentialsToVault = "saveCredentialsToVault",
    SaveUsedCredentials = "saveUsedCredentials",
    SearchEntriesByTerm = "searchEntriesByTerm",
    SearchEntriesByURL = "searchEntriesByURL",
    SetConfigurationValue = "setConfigurationValue",
    TrackRecentEntry = "trackRecentEntry"
}

export interface BackgroundResponse {
    available?: boolean;
    autoLogin?: SearchResult | null;
    config?: Configuration;
    credentials?: Array<UsedCredentials | null>;
    domains?: Array<string>;
    entryID?: EntryID | null;
    error?: Error;
    locked?: boolean;
    opened?: boolean;
    otps?: Array<OTP>;
    searchResults?: Array<SearchResult>;
    vaultSources?: Array<VaultSourceDescription>;
    vaultsTree?: VaultsTree;
}

type ChildElement = ReactChild | ReactChildren | false | null;
export type ChildElements = ChildElement | Array<ChildElement>;

export interface Configuration {
    entryIcons: boolean;
    inputButtonDefault: InputButtonType;
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

export enum InputButtonType {
    InnerIcon = "innericon",
    LargeButton = "largebutton"
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
    About = "about",
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
    promptSave: boolean;
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
    [key: string]: VaultsTreeItem;
}

export interface VaultsTreeItem extends VaultFacade {
    name: string;
}

export enum VaultType {
    Dropbox = "dropbox",
    File = "file",
    GoogleDrive = "googledrive",
    WebDAV = "webdav"
}
