import { initialise as initialiseMessaging } from "./messaging.js";
import { initialise as initialiseForms } from "./form.js";

export async function initialise() {
    await initialiseMessaging();
    await initialiseForms();
}
