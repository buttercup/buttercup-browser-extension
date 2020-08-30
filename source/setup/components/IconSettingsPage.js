import React from "react";
import browserInfo from "browser-info";
import { Button, ButtonGroup, Classes, Intent } from "@blueprintjs/core";
import { dispatch } from "../redux/index.js";
import LayoutMain from "./LayoutMain.js";
import { setConfigValue } from "../../shared/actions/app.js";
import { closeCurrentTab } from "../../shared/library/extension.js";

function setIconSetting(enabled) {
    dispatch(
        setConfigValue({
            key: "dynamicIcons",
            value: enabled ? "enabled" : "disabled"
        })
    );
    setTimeout(closeCurrentTab, 0);
}

export default () => (
    <LayoutMain title="Dynamic Icons">
        <div className={Classes.RUNNING_TEXT}>
            <h3>Beautiful brand icons for your entries</h3>
            <p>
                Buttercup can fetch icons for all of your web-based accounts automatically using the new{" "}
                <strong>dynamic-icon</strong> feature. The icons are fetched automatically as you view items in search
                results or in the vault editor.
            </p>
            <p>
                Simply add a URL to an entry for an icon to be fetched. Icons are fetched by requesting information from
                the domain of the URL that you add.
            </p>
            <h3>Privacy first</h3>
            <p>
                Icons are <strong>not</strong> requested directly from the website referenced, but via our anonymous
                icon proxy service. We don't record any personal information, or any analytics, and only require the{" "}
                <strong>domain</strong> from each URL.
            </p>
            <h3>Enable or Disable this setting</h3>
            <p>You must enable or disable this setting for this information page to disappear.</p>
            <div>
                <center>
                    <ButtonGroup>
                        <Button intent={Intent.PRIMARY} onClick={() => setIconSetting(true)}>
                            Enable
                        </Button>
                        <Button onClick={() => setIconSetting(false)}>Disable</Button>
                    </ButtonGroup>
                </center>
            </div>
        </div>
    </LayoutMain>
);
