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
    [BackgroundMessageType.CheckDesktopConnection]: {
        type: BackgroundMessageType.CheckDesktopConnection;
    };
    [BackgroundMessageType.InitiateDesktopConnection]: {
        type: BackgroundMessageType.InitiateDesktopConnection;
    };
}

export enum BackgroundMessageType {
    CheckDesktopConnection = "checkDesktopConnection",
    InitiateDesktopConnection = "initiateDesktopConnection"
}

export interface BackgroundResponse {
    [BackgroundMessageType.CheckDesktopConnection]: {
        available: boolean;
        error?: Error;
    };
    [BackgroundMessageType.InitiateDesktopConnection]: {
        error?: Error;
    };
}

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
    GoogleDrive = "googledrive",
    LocalFile = "localfile",
    WebDAV = "webdav"
}
