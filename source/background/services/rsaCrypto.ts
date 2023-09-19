import { Layerr } from "layerr";
import {
    arrayBufferToString,
    base64DecodeUnicode,
    base64EncodeUnicode,
    stringToArrayBuffer
} from "../../shared/library/buffer.js";
import { API_KEY_ALGO, API_KEY_HASH } from "../../shared/symbols.js";
import { isValidRSAPrivateKey, isValidRSAPublicKey } from "./rsaKeys.js";

export async function decryptPayload(
    payload: string,
    sourcePublicKey: string,
    targetPrivateKey: string
): Promise<string> {
    if (!isValidRSAPrivateKey(targetPrivateKey)) {
        throw new Error("Cannot encrypt: Invalid private key");
    }
    if (!isValidRSAPublicKey(sourcePublicKey)) {
        throw new Error("Cannot encrypt: Invalid public key");
    }
    const privateKey = await importPrivateKey(targetPrivateKey);
    const publicKey = await importPublicKey(sourcePublicKey);
    const encoder = new TextEncoder();
    const decrypted = await window.crypto.subtle.decrypt(
        {
            name: API_KEY_ALGO
        },
        privateKey,
        // encoder.encode(payload)
        stringToArrayBuffer(base64DecodeUnicode(payload))
    );
    return arrayBufferToString(decrypted);
}

export async function encryptPayload(
    payload: string,
    sourcePrivateKey: string,
    targetPublicKey: string
): Promise<string> {
    if (!isValidRSAPrivateKey(sourcePrivateKey)) {
        throw new Error("Cannot encrypt: Invalid private key");
    }
    if (!isValidRSAPublicKey(targetPublicKey)) {
        throw new Error("Cannot encrypt: Invalid public key");
    }
    const privateKey = await importPrivateKey(sourcePrivateKey);
    const publicKey = await importPublicKey(targetPublicKey);
    const encoder = new TextEncoder();
    const encrypted = await window.crypto.subtle.encrypt(
        {
            name: API_KEY_ALGO
        },
        publicKey,
        // encoder.encode(payload)
        stringToArrayBuffer(payload)
    );
    return base64EncodeUnicode(arrayBufferToString(encrypted));
}

async function importPrivateKey(privateKey: string): Promise<CryptoKey> {
    console.log("PRV RAW", privateKey);
    const shaved = privateKey
        .replace(/-----BEGIN PRIVATE KEY-----/, "")
        .replace(/-----END PRIVATE KEY-----/, "")
        .replace(/\n/g, "")
        .trim();
    console.log("PRV", shaved);
    const derb64 = base64DecodeUnicode(shaved);
    // const decoded = base64DecodeUnicode(shaved);
    // const derb64 = window.atob(shaved);
    // console.log("DER", derb64, stringToArrayBuffer(derb64));
    const buffer = stringToArrayBuffer(derb64);
    console.log("IMPORT", [
        "pkcs8",
        buffer,
        {
            name: API_KEY_ALGO,
            hash: API_KEY_HASH
        },
        true,
        ["decrypt"]
    ]);
    try {
        const cryptoKey = await window.crypto.subtle.importKey(
            "pkcs8",
            buffer,
            {
                name: API_KEY_ALGO,
                hash: API_KEY_HASH
            },
            true,
            ["decrypt"]
        );
        return cryptoKey;
    } catch (err) {
        throw new Layerr(err, "Failed importing private key");
    }
}

async function importPublicKey(publicKey: string): Promise<CryptoKey> {
    console.log("PUB RAW", publicKey);
    const shaved = publicKey
        .replace(/-----BEGIN PUBLIC KEY-----/, "")
        .replace(/-----END PUBLIC KEY-----/, "")
        .replace(/\n/g, "")
        .trim();
    console.log("PUB", shaved);
    const decoded = base64DecodeUnicode(shaved);
    // const decoded = window.atob(shaved);
    const buffer = stringToArrayBuffer(decoded);
    return window.crypto.subtle.importKey(
        "spki",
        buffer,
        {
            name: API_KEY_ALGO,
            hash: { name: API_KEY_HASH }
        },
        true,
        ["encrypt"]
    );
}
