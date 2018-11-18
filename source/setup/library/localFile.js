import { buildClient, completeConnection, initiateConnection } from "../../shared/library/secureFileClient.js";

let __client;

export function createNewClient() {}

export function receiveAuthKey(code) {
    return completeConnection(code);
}

export function requestConnection() {
    return initiateConnection();
}
