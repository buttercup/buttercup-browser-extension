import { InputType } from "../shared/types.js";

export * from "../shared/types.js";

export interface FrameEvent {
    formID?: string;
    inputDetails?: {
        otp?: string;
        password?: string;
        username?: string;
    };
    inputType?: InputType;
    type: FrameEventType;
}

export enum FrameEventType {
    FillForm = "fillForm"
}
