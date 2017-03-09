import addListeners from "./messaging";
import { updateAll } from "./archives";

const UPDATE_EVERY_MINUTES = 5;

// init
window.Buttercup.Web.HashingTools.patchCorePBKDF();
addListeners();

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

