import { ulid } from "ulidx";
import { getElementRectInDocument, recalculateRectForIframe } from "../library/position.js";
import { FORM } from "../state/form.js";
import { FRAME } from "../state/frame.js";
import { closePopup, togglePopup } from "../ui/popup.js";
import { waitAndAttachLaunchButtons } from "./detection.js";
import { broadcastFrameMessage, listenForTabEvents, sendTabEvent } from "./messaging.js";
import { findIframeForWindow } from "../library/frames.js";
import { FrameEvent, FrameEventType, InputType, TabEventType } from "../types.js";

export function fillFormDetails(frameEvent: FrameEvent) {
    const { currentLoginTarget: loginTarget } = FORM;
    const { inputDetails } = frameEvent;
    if (inputDetails.username) {
        loginTarget.fillUsername(inputDetails.username);
    }
    if (inputDetails.password) {
        loginTarget.fillPassword(inputDetails.password);
    }
    if (inputDetails.otp) {
        loginTarget.fillOTP(inputDetails.otp);
    }
    FORM.currentFormID = null;
    FORM.currentLoginTarget = null;
    closePopup();
}

export async function initialise() {
    // Watch for forms
    waitAndAttachLaunchButtons((input, loginTarget, inputType) => {
        FORM.currentFormID = ulid();
        FORM.currentLoginTarget = loginTarget;
        if (FRAME.isTop) {
            FORM.targetFormID = FORM.currentFormID;
            togglePopup(getElementRectInDocument(input), inputType);
        } else {
            sendTabEvent(
                {
                    type: TabEventType.OpenPopupDialog,
                    formID: FORM.currentFormID,
                    inputPosition: getElementRectInDocument(input),
                    inputType
                },
                window.parent
            );
        }
    });
    // Listen for tab-specific events
    listenForTabEvents((tabEvent) => {
        if (tabEvent.type === TabEventType.InputDetails) {
            // Detect where to send the chosen details
            if (FORM.currentFormID && tabEvent.formID === FORM.currentFormID) {
                // This tab+frame is expecting these credentials
                fillFormDetails({
                    formID: tabEvent.formID,
                    inputDetails: tabEvent.inputDetails,
                    inputType: tabEvent.inputType,
                    type: FrameEventType.FillForm
                });
            } else if (!FORM.currentFormID || FORM.currentFormID !== tabEvent.formID) {
                // Destination is another tab
                broadcastFrameMessage({
                    formID: tabEvent.formID,
                    inputDetails: tabEvent.inputDetails,
                    inputType: tabEvent.inputType,
                    type: FrameEventType.FillForm
                });
            } else {
                throw new Error("Unexpected details input state");
            }
        } else if (tabEvent.type === TabEventType.OpenPopupDialog) {
            // Re-calculate based upon the iframe the message came from
            const frame = findIframeForWindow(tabEvent.sourceURL);
            if (!frame) {
                console.error("Failed presening Buttercup popup: Could not trace iframe nesting");
                return;
            }
            const newPosition = recalculateRectForIframe(tabEvent.inputPosition, frame);
            // Show if top, or pass on to the next frame above
            if (FRAME.isTop) {
                FORM.targetFormID = tabEvent.formID;
                togglePopup(newPosition, tabEvent.inputType);
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
}
