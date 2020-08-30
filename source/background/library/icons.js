import { getState } from "../redux/index.js";
import { getConfig } from "../../shared/selectors/app.js";
import { createNewTab, getExtensionURL } from "../../shared/library/extension.js";

export function checkDynamicIconSetting() {
    const { dynamicIcons } = getConfig(getState());
    if (!dynamicIcons) {
        createNewTab(getExtensionURL("setup.html#/settings/icons"));
    }
}
