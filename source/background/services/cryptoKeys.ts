import { ulid } from "ulidx";
import { log } from "./log.js";
import { getLocalValue, setLocalValue } from "./storage.js";
import {
    arrayBufferToHex,
    arrayBufferToString,
    base64DecodeUnicode,
    base64EncodeUnicode,
    stringToArrayBuffer
} from "../../shared/library/buffer.js";
import { API_KEY_ALGO, API_KEY_CURVE } from "../../shared/symbols.js";
import { LocalStorageItem } from "../types.js";
import { Layerr } from "layerr";

async function createKeys(): Promise<{
    privateKey: string;
    publicKey: string;
}> {
    const { privateKey, publicKey } = await window.crypto.subtle.generateKey(
        {
            name: API_KEY_ALGO,
            namedCurve: API_KEY_CURVE
        },
        true,
        ["deriveKey"]
    );
    log("generating public and private key pair for browser auth");
    const privateKeyStr = await exportECDHKey(privateKey);
    const publicKeyStr = await exportECDHKey(publicKey);
    log("generated new browser auth keys");
    return {
        privateKey: privateKeyStr,
        publicKey: publicKeyStr
    };
}

export async function deriveSecretKey(privateKey: CryptoKey, publicKey: CryptoKey): Promise<string> {
    let cryptoKey: CryptoKey;
    try {
        console.log("1a");
        cryptoKey = await window.crypto.subtle.deriveKey(
            {
                name: API_KEY_ALGO,
                public: publicKey
            },
            privateKey,
            {
                name: "AES-GCM",
                length: 256
            },
            true,
            ["encrypt", "decrypt"]
        );
        console.log("1b");
    } catch (err) {
        throw new Layerr(err, "Failed deriving secret key");
    }
    const exported = await window.crypto.subtle.exportKey("raw", cryptoKey);
    return arrayBufferToHex(exported);
}

async function exportECDHKey(key: CryptoKey): Promise<string> {
    try {
        if (key.type === "private") {
            const exported = await window.crypto.subtle.exportKey("jwk", key);
            return base64EncodeUnicode(exported.d);
        }
        const exported = await window.crypto.subtle.exportKey("raw", key);
        return base64EncodeUnicode(arrayBufferToString(exported));
    } catch (err) {
        throw new Layerr(err, `Failed exporting ECDH key (${key.type})`);
    }
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
    const { privateKey, publicKey } = await createKeys();
    clientID = ulid();
    await setLocalValue(LocalStorageItem.APIPrivateKey, privateKey);
    await setLocalValue(LocalStorageItem.APIPublicKey, publicKey);
    await setLocalValue(LocalStorageItem.APIClientID, clientID);
}

export async function importECDHKey(key: string, isPrivate: boolean): Promise<CryptoKey> {
    const buffer = stringToArrayBuffer(base64DecodeUnicode(key));
    try {
        return window.crypto.subtle.importKey(
            "raw",
            buffer,
            {
                name: API_KEY_ALGO,
                namedCurve: API_KEY_CURVE
            },
            true,
            isPrivate ? ["deriveKey"] : []
        );
    } catch (err) {
        throw new Layerr(err, "Failed importing ECDH key");
    }
}
