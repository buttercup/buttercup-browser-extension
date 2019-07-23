import queryString from "query-string";
import { Datasources, Web } from "../../shared/library/buttercup.js";
import "../../shared/library/LocalFileDatasource.js";

export function initialise() {
    Web.HashingTools.patchCorePBKDF();
}
