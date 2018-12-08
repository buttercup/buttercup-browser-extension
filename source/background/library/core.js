import queryString from "query-string";
import { Datasources, Web } from "../../shared/library/buttercup.js";
import "../../shared/library/LocalFileDatasource.js";

export function initialise() {
    Web.HashingTools.patchCorePBKDF();
    const { DropboxDatasource, registerDatasourcePostProcessor } = Datasources;
    registerDatasourcePostProcessor((type, datasource) => {
        if (type === "dropbox") {
            datasource.client.patcher.patch("request", args => {
                let url = args.url;
                if (args.params) {
                    url += `?${queryString.stringify(args.params)}`;
                }
                return fetch(url, {
                    method: args.method || "GET",
                    headers: args.headers || {},
                    body: args.data
                }).then(resp => {
                    return resp.text().then(txt => ({
                        data: txt,
                        status: resp.status,
                        statusText: resp.statusText,
                        headers: resp.headers
                    }));
                });
            });
        }
    });
}
