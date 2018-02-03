import { Web } from "../../shared/library/buttercup.js";

export function initialise() {
    Web.HashingTools.patchCorePBKDF();
}
