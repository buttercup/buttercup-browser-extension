export * from "../shared/types.js";

export interface ElementRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface TabEvent {
    inputPosition?: ElementRect;
    source?: MessageEventSource;
    sourceURL?: string;
    type: TabEventType;
}

export enum TabEventType {
    GetFrameID = "getFrameID",
    OpenPopupDialog = "openPopupDialog"
}
