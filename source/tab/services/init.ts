import { initialise as initialiseMessaging } from "./messaging.js";
import { initialise as initialiseForms } from "./form.js";
import { initialise as initialiseCredentialsWatching } from "./credentialsWatcher.js";

export async function initialise() {
    await initialiseMessaging();
    await initialiseForms();
    initialiseCredentialsWatching();
}
