import { getElementRectInDocument, recalculateRectForIframe } from "./library/position.js";
import { waitAndAttachLaunchButtons } from "./services/detection.js";
import { findIframeForWindow } from "./services/frames.js";
import { listenForTabEvents, sendTabEvent } from "./services/messaging.js";
import { TabEventType } from "./types.js";
import { renderPopup } from "./ui/popup.js";

const IS_TOP = window.parent === window;

waitAndAttachLaunchButtons((input) => {
    if (IS_TOP) {
        renderPopup(getElementRectInDocument(input));
    } else {
        sendTabEvent(
            {
                type: TabEventType.OpenPopupDialog,
                inputPosition: getElementRectInDocument(input)
            },
            window.parent
        );
    }
});

listenForTabEvents((tabEvent) => {
    if (tabEvent.type === TabEventType.OpenPopupDialog) {
        // Re-calculate based upon the iframe the message came from
        const frame = findIframeForWindow(tabEvent.sourceURL);
        if (!frame) {
            console.error("Failed presening Buttercup popup: Could not trace iframe nesting");
            return;
        }
        const newPosition = recalculateRectForIframe(tabEvent.inputPosition, frame);
        // Show if top, or pass on to the next frame above
        if (IS_TOP) {
            renderPopup(newPosition);
        } else {
            sendTabEvent(
                {
                    ...tabEvent,
                    inputPosition: newPosition
                },
                window.parent
            );
        }
    }
});
