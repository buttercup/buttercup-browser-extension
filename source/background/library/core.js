import { Web } from "../../shared/library/buttercup.js";
import "../../shared/library/SecureFileHostDatasource.js";

export function initialise() {
    Web.HashingTools.patchCorePBKDF();
}
