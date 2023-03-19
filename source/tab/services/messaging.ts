import { TabEvent, TabEventType } from "../types.js";

// let __bc: BroadcastChannel;

// export function listenForTabEvents(callback: (event: TabEvent) => void) {
//     if (!__bc) {
//         __bc = new BroadcastChannel("tab");
//     }
//     __bc.addEventListener("message", (event: MessageEvent<TabEvent>) => {
//         callback(event.data);
//     });
// }

// export function sendTabEvent(event: TabEvent, destination: Window): void {

// }

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
