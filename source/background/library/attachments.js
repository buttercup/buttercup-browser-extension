import { AttachmentManager } from "../../shared/library/buttercup.js";
import { getVaultManager } from "./buttercup.js";
import { arrayBufferToBase64, base64ToArrayBuffer } from "../../shared/library/buffer.js";

async function addAttachment(sourceID, entryID, file) {
    const { data, name, type } = file;
    const buff = base64ToArrayBuffer(data);
    const vm = await getVaultManager();
    const source = vm.getSourceForID(sourceID);
    const entry = source.vault.findEntryByID(entryID);
    await source.attachmentManager.setAttachment(entry, AttachmentManager.newAttachmentID(), buff, name, type);
    await source.save();
}

export async function addAttachments(sourceID, entryID, files) {
    for (const file of files) {
        await addAttachment(sourceID, entryID, file);
    }
}

export async function deleteAttachment(sourceID, entryID, attachmentID) {
    const vm = await getVaultManager();
    const source = vm.getSourceForID(sourceID);
    const entry = source.vault.findEntryByID(entryID);
    await source.attachmentManager.removeAttachment(entry, attachmentID);
    await source.save();
}

export async function getAttachment(sourceID, entryID, attachmentID) {
    const vm = await getVaultManager();
    const source = vm.getSourceForID(sourceID);
    const entry = source.vault.findEntryByID(entryID);
    const buff = await source.attachmentManager.getAttachment(entry, attachmentID);
    return arrayBufferToBase64(buff);
}
