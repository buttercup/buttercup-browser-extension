import { EncryptionAlgorithm, createAdapter } from "iocane";
import { deriveSecretKey, importECDHKey } from "./cryptoKeys.js";

export async function decryptPayload(
    payload: string,
    sourcePublicKey: string,
    targetPrivateKey: string
): Promise<string> {
    const privateKey = await importECDHKey(targetPrivateKey, true);
    const publicKey = await importECDHKey(sourcePublicKey, false);
    const secret = await deriveSecretKey(privateKey, publicKey);
    return createAdapter().decrypt(payload, secret) as Promise<string>;
}

export async function encryptPayload(
    payload: string,
    sourcePrivateKey: string,
    targetPublicKey: string
): Promise<string> {
    console.log("PRV!?");
    const privateKey = await importECDHKey(sourcePrivateKey, true);
    console.log("PUB!?");
    const publicKey = await importECDHKey(targetPublicKey, false);
    console.log("SEC!!!");
    const secret = await deriveSecretKey(privateKey, publicKey);
    console.log("ENC!!!!");
    return createAdapter()
        .setAlgorithm(EncryptionAlgorithm.GCM)
        .setDerivationRounds(100000)
        .encrypt(payload, secret) as Promise<string>;
}
