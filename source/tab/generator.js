import mucus from "mucus";
import listen from "event-listener";
import { DIALOG_TYPE_PASSWORD_GENERATOR, showInputDialog } from "./inputDialog.js";

const __trackedInputs = [];
const __trackingListeners = [];

let __currentInput, __stopTracking;

export function openGeneratorForCurrentInput() {
    if (!__currentInput) {
        console.error("Tried opening password generator, but no input marked as current");
    }
    showInputDialog(__currentInput, DIALOG_TYPE_PASSWORD_GENERATOR);
}

function stopTrackingInputs() {
    __stopTracking();
    __trackedInputs.splice(0, __trackedInputs.length);
    __trackingListeners.forEach(tracker => {
        try {
            tracker.remove();
        } catch (err) {}
    });
    __trackingListeners.splice(0, __trackingListeners.length);
}

function trackInput(input) {
    if (__trackedInputs.includes(input)) {
        return;
    }
    const inputType = input.getAttribute("type");
    if (inputType && (inputType !== "text" && inputType !== "password")) {
        return;
    }
    __trackedInputs.push(input);
    const enterListener = listen(input, "mouseenter", function onEnter() {
        __currentInput = input;
    });
    __trackingListeners.push(enterListener);
}

export function watchInputs() {
    if (__stopTracking) {
        stopTrackingInputs();
    }
    // check existing
    [...document.getElementsByTagName("input")].forEach(input => trackInput(input));
    // watch for new ones
    __stopTracking = mucus(document.body, function(changes) {
        changes.added.filter(item => item instanceof HTMLInputElement).forEach(input => trackInput(input));
    });
}
