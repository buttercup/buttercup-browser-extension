import { FORM } from "../state/form.js";
import { fillFormDetails } from "./form.js";
import { closeDialog } from "../ui/saveDialog.js";
import { getExtensionAPI } from "../../shared/extension.js";
import { FrameEvent, FrameEventType, TabEvent, TabEventType } from "../types.js";

let __framesChannel: BroadcastChannel;

export function broadcastFrameMessage(event: FrameEvent): void {
    __framesChannel.postMessage(event);
}

export async function initialise() {
    __framesChannel = new BroadcastChannel("frames:all");
    __framesChannel.addEventListener("message", handleFramesBroadcast);
    const browser = getExtensionAPI();
    browser.runtime.onMessage.addListener(handleTabMessage);
}

function handleFramesBroadcast(event: MessageEvent<FrameEvent>) {
    const { type } = event.data;
    if (type === FrameEventType.FillForm) {
        const { formID } = event.data;
        if (formID && formID === FORM.currentFormID && FORM.currentLoginTarget) {
            fillFormDetails(event.data);
        }
    }
}

function handleTabMessage(payload: unknown) {
    if (
        !payload ||
        typeof payload !== "object" ||
        Object.values(TabEventType).includes((payload as any).type) === false
    ) {
        return;
    }
    const event = payload as TabEvent;
    if (event.type === TabEventType.CloseSaveDialog) {
        closeDialog();
    }
}

export function listenForTabEvents(callback: (event: TabEvent) => void) {
    window.addEventListener("message", (event: MessageEvent<any>) => {
        if (event.data?.type && Object.values(TabEventType).includes(event.data?.type)) {
            callback({
                ...(event.data as TabEvent),
                source: event.source
            });
        }
    });
}

export function sendTabEvent(event: TabEvent, destination: MessageEventSource): void {
    const payload: TabEvent = {
        ...event,
        sourceURL: `${window.location.href}`
    };
    if (destination instanceof Window) {
        destination.postMessage(payload, "*");
    } else {
        destination.postMessage(payload);
    }
}
