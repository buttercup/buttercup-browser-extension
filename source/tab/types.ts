export * from "../shared/types.js";

export interface FrameEvent {
    formID?: string;
    inputDetails?: {
        otp?: string;
        password?: string;
        username?: string;
    };
    type: FrameEventType;
}

export enum FrameEventType {
    FillForm = "fillForm"
}
