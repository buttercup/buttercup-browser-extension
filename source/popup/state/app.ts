import { createStateObject } from "obstate";
import { PopupPage } from "../types.js";

export const APP_STATE = createStateObject<{
    tab: PopupPage;
}>({
    tab: PopupPage.Entries
});
