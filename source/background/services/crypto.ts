import { EncryptionAlgorithm, createAdapter } from "iocane";
import { deriveSecretKey, importECDHKey } from "./cryptoKeys.js";

export async function decryptPayload(
    payload: string,
    sourcePublicKey: string,
    targetPrivateKey: string
): Promise<string> {
    const privateKey = await importECDHKey(targetPrivateKey);
    const publicKey = await importECDHKey(sourcePublicKey);
    const secret = await deriveSecretKey(privateKey, publicKey);
    return createAdapter().decrypt(payload, secret) as Promise<string>;
}

export async function encryptPayload(
    payload: string,
    sourcePrivateKey: string,
    targetPublicKey: string
): Promise<string> {
    const privateKey = await importECDHKey(sourcePrivateKey);
    const publicKey = await importECDHKey(targetPublicKey);
    const secret = await deriveSecretKey(privateKey, publicKey);
    return createAdapter()
        .setAlgorithm(EncryptionAlgorithm.GCM)
        .setDerivationRounds(100000)
        .encrypt(payload, secret) as Promise<string>;
}
