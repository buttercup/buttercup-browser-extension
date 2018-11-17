import joinURL from "url-join";
import { createSession } from "iocane";

const BASE_URL = "http://localhost:12821";

export function buildClient(token) {
    return {
        readdir: (remotePath, callback) => {
            const url = joinURL(BASE_URL, "/get/directory");
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
                        return response.json().then(data => callback(null, data));
                    }
                    throw new Error(`Failed reading remote file: ${remotePath}`);
                })
                .catch(callback);
        },

        readFile: (remotePath, options, callback) => {
            const cb = typeof options === "function" ? options : callback;
            const url = joinURL(BASE_URL, "/get/file");
            createSession()
                .encrypt(remotePath, token)
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
                        return response.text();
                    }
                    throw new Error(`Failed reading remote file: ${remotePath}`);
                })
                .then(contents => createSession().decrypt(contents, token))
                .then(data => {
                    callback(null, data);
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
                    }),
                    token
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
                    throw new Error(`Failed writing remote file: ${remotePath}`);
                })
                .catch(callback);
        }
    };
}
