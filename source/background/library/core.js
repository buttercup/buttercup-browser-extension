import Buttercup from "buttercup/dist/buttercup-web.js";

export function initialise() {
    Buttercup.Web.HashingTools.patchCorePBKDF();
}
