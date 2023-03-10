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

// type BackgroundMessageMap = {
//     [BackgroundMessageType.CheckDesktopConnection]: {
//         type: BackgroundMessageType.CheckDesktopConnection;
//     };
//     [BackgroundMessageType.InitiateDesktopConnection]: {
//         type: BackgroundMessageType.InitiateDesktopConnection;
//     };
// }

// export type BackgroundMessage<T extends BackgroundMessageType> = BackgroundMessageMap[T];

// export type BackgroundMessage<T extends BackgroundMessageType> = (
//     T extends BackgroundMessageType.CheckDesktopConnection ? {
//         type: T;
//     } : never
// );

export interface BackgroundMessage {
    code?: string;
    type: BackgroundMessageType;
}

export enum BackgroundMessageType {
    AuthenticateDesktopConnection = "authenticateDesktopConnection",
    CheckDesktopConnection = "checkDesktopConnection",
    InitiateDesktopConnection = "initiateDesktopConnection",
    GetDesktopVaultSources = "getDesktopVaultSources"
}

// type BackgroundResponseMap = {
//     [BackgroundMessageType.CheckDesktopConnection]: {
//         available: boolean;
//         error?: Error;
//     };
//     [BackgroundMessageType.InitiateDesktopConnection]: {
//         error?: Error;
//     };
// }

// export type BackgroundResponse<T extends BackgroundMessageType> = BackgroundResponseMap[T];

// export type BackgroundResponse<T extends BackgroundMessageType> = (
//     T extends BackgroundMessageType.CheckDesktopConnection ? {
//         available: boolean;
//         // type: BackgroundMessageType.CheckDesktopConnection;
//     } : never
// );

export interface BackgroundResponse {
    available?: boolean;
    error?: Error;
    vaultSources?: Array<VaultSourceDescription>;
}

// export interface BackgroundResponse {
//     [BackgroundMessageType.CheckDesktopConnection]: {
//         available: boolean;
//         error?: Error;
//     };
//     [BackgroundMessageType.InitiateDesktopConnection]: {
//         error?: Error;
//     };
// }

// interface BackgroundResponseBase {
//     error?: Error;
// }
// export type BackgroundResponse<T extends BackgroundMessageType> = (BackgroundResponseBase & (
//     [T is BackgroundMessageType.CheckDesktopConnection] => {
//         available?: boolean;
//         type: BackgroundMessageType.CheckDesktopConnection;
//     }
// ));

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
