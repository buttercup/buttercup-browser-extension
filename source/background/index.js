import addMessagingListeners from "./messaging";
import addHotkeyListeners from "./hotkeys";
import { updateAll } from "./archives";

const UPDATE_EVERY_MINUTES = 5;

// init
window.Buttercup.Web.HashingTools.patchCorePBKDF();
addMessagingListeners();
addHotkeyListeners();

// automatic archive updating
(function autoUpdate() {
    setTimeout(function() {
        console.log("Updating...");
        updateAll()
            .then(function() {
                console.log("Done.");
                autoUpdate();
            })
            .catch(function(err) {
                console.error(`An error occurred while updating: ${err.message}`);
                autoUpdate();
            });
    }, UPDATE_EVERY_MINUTES * 60 * 1000);
})();
