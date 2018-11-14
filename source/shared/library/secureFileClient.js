import joinURL from "url-join";
import { createSession } from "iocane";

const BASE_URL = "http://localhost:12821";

export function buildClient(token) {
    return {
        readFile: (remotePath, options, callback) => {
            const cb = typeof options === "function" ? options : callback;
            const url = joinURL(BASE_URL, "/get/file");
            createSession()
                .encrypt(remotePath)
                .then(payload =>
                    fetch({
                        url,
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json; charset=utf-8"
                        },
                        body: JSON.stringify({
                            payload
                        })
                    })
                )
                .then(response => {
                    if (response.ok && response.status === 200) {
                        // callback(null, response);
                        return response.text().then(data => callback(null, data));
                    }
                    callback(new Error(`Failed reading remote file: ${remotePath}`));
                })
                .catch(callback);
        },

        writeFile: (remotePath, data, options, callback) => {
            const cb = typeof options === "function" ? options : callback;
            if (typeof data !== "string") {
                throw new Error("Failed writing file: Expected data to be of type string");
            }
            const url = joinURL(BASE_URL, "/put/file");
            createSession()
                .encrypt(
                    JSON.stringify({
                        filename: remotePath,
                        content: data
                    })
                )
                .then(payload =>
                    fetch({
                        url,
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json; charset=utf-8"
                        },
                        body: JSON.stringify({
                            payload
                        })
                    })
                )
                .then(response => {
                    if (response.ok && response.status === 200) {
                        callback();
                        return;
                    }
                    callback(new Error(`Failed writing remote file: ${remotePath}`));
                })
                .catch(callback);
        }
    };
}
