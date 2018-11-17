import { Web } from "../../shared/library/buttercup.js";
import "../../shared/library/LocalFileDatasource.js";

export function initialise() {
    Web.HashingTools.patchCorePBKDF();
}
