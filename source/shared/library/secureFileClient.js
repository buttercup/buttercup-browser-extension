import joinURL from "url-join";
import { createSession } from "iocane";
import log from "./log.js";

const BASE_URL = "http://localhost:12821";

export function buildClient(token) {
    return {
        readdir: (remotePath, callback) => {
            const url = joinURL(BASE_URL, "/get/directory");
            createSession()
                .encrypt(remotePath, token)
                .then(payload =>
                    fetch(url, {
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
                        return response.json();
                    }
                    throw new Error(`Failed reading remote file: ${remotePath}`);
                })
                .then(response => createSession().decrypt(response.payload, token))
                .then(JSON.parse)
                .then(results => callback(null, results))
                .catch(callback);
        },

        readFile: (remotePath, options, callback) => {
            const cb = typeof options === "function" ? options : callback;
            const url = joinURL(BASE_URL, "/get/file");
            createSession()
                .encrypt(remotePath, token)
                .then(payload =>
                    fetch(url, {
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
                    fetch(url, {
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

export function completeConnection(code) {
    if (!code) {
        return Promise.reject(new Error("Code is required"));
    }
    const codeURL = joinURL(BASE_URL, `/connect/${code}`);
    log.info("Completing handshake using code");
    return fetch(codeURL)
        .then(response => response.json())
        .then(resp => {
            if (resp.status !== "ok") {
                throw new Error("Connection response status was not OK");
            }
            const { payload } = resp;
            return createSession()
                .decrypt(payload, code)
                .then(key => {
                    log.info("Received key: Handshake complete");
                    return key;
                });
        });
}

export function initiateConnection() {
    const pingURL = BASE_URL;
    const connectURL = joinURL(BASE_URL, "/connect");
    log.info("Checking local endpoint");
    return fetch(pingURL)
        .then(response => response.json())
        .then(response => {
            log.info(`Received status from local endpoint: ${response.status} (ready: ${response.ready.toString()})`);
            if (response.status !== "ok") {
                throw new Error("Received non-OK status");
            } else if (!response.ready) {
                throw new Error("Endpoint is not yet ready");
            }
            log.info("Beginning handshake");
            return fetch(connectURL)
                .then(response => response.json())
                .then(response => {
                    if (response.status !== "ok") {
                        throw new Error("Endpoint connection procedure failed");
                    }
                    log.info("Initial connection phase completed");
                });
        });
}
