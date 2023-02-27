import { VaultSourceID } from "buttercup";
// import { Layerr } from "layerr";
// import { BackgroundMessageType } from "../types.js";
// import { sendBackgroundMessage } from "./messaging.js";

// export async function removeSource(sourceID: VaultSourceID): Promise<void> {
//     const resp = await sendBackgroundMessage<{
//         error?: Error;
//     }>({
//         type: BackgroundMessageType.RemoveSource,
//         sourceID
//     });
//     if (resp.error) {
//         throw new Layerr(resp.error, "Failed to remove vault");
//     }
// }

export async function unlockSource(sourceID: VaultSourceID): Promise<void> {
    // const resp = await sendBackgroundMessage<{
    //     error?: Error;
    // }>({
    //     type: BackgroundMessageType.UnlockSource,
    //     sourceID,
    //     password
    // });
    // if (resp.error) {
    //     throw new Layerr(resp.error, "Failed to unlock vault");
    // }
}
