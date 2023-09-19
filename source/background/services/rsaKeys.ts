import { ulid } from "ulidx";
import { log } from "./log.js";
import { getLocalValue, setLocalValue } from "./storage.js";
import { arrayBufferToString, base64EncodeUnicode } from "../../shared/library/buffer.js";
import { API_KEY_ALGO, API_KEY_HASH } from "../../shared/symbols.js";
import { LocalStorageItem } from "../types.js";

function addNewLines(str: string): string {
    let finalString = "";
    for (var i = 0; i < str.length; i += 1) {
        finalString += str.substring(0, 64) + "\n";
        str = str.substring(64);
    }
    finalString += str;
    return finalString;
}

async function createRSAKeys() {
    const { privateKey, publicKey } = await window.crypto.subtle.generateKey(
        {
            name: API_KEY_ALGO,
            modulusLength: 2048,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: { name: API_KEY_HASH }
        },
        true,
        ["encrypt", "decrypt", "wrapKey", "unwrapKey"]
    );
    const privateKeyStr = await exportRSAPrivateKey(privateKey);
    const publicKeyStr = await exportRSAPublicKey(publicKey);
    return {
        privateKey: privateKeyStr,
        publicKey: publicKeyStr
    };
}

async function exportRSAPrivateKey(key: CryptoKey): Promise<string> {
    const exported = await window.crypto.subtle.exportKey("pkcs8", key);
    const exportedAsString = arrayBufferToString(exported);
    const exportedAsBase64 = addNewLines(base64EncodeUnicode(exportedAsString)).trim();
    return `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64}\n-----END PRIVATE KEY-----`;
}

async function exportRSAPublicKey(key: CryptoKey): Promise<string> {
    const exported = await window.crypto.subtle.exportKey("spki", key);
    const exportedAsString = arrayBufferToString(exported);
    const exportedAsBase64 = addNewLines(base64EncodeUnicode(exportedAsString)).trim();
    return `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
}

export async function generateKeys(): Promise<void> {
    let [apiPrivate, apiPublic, clientID] = await Promise.all([
        getLocalValue(LocalStorageItem.APIPrivateKey),
        getLocalValue(LocalStorageItem.APIPublicKey),
        getLocalValue(LocalStorageItem.APIClientID)
    ]);
    if (apiPrivate && apiPublic && clientID) return;
    // Regenerate
    log("api keys missing: will generate");
    const { privateKey, publicKey } = await createRSAKeys();
    clientID = ulid();
    await setLocalValue(LocalStorageItem.APIPrivateKey, privateKey);
    await setLocalValue(LocalStorageItem.APIPublicKey, publicKey);
    await setLocalValue(LocalStorageItem.APIClientID, clientID);
}

export function isValidRSAPrivateKey(key: string): boolean {
    return /^-----BEGIN PRIVATE KEY-----(\n|.)+-----END PRIVATE KEY-----$/m.test(key);
}

export function isValidRSAPublicKey(key: string): boolean {
    return /^-----BEGIN PUBLIC KEY-----(\n|.)+-----END PUBLIC KEY-----$/m.test(key);
}
