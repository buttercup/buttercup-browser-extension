import React from "react";
import browserInfo from "browser-info";
import { Classes } from "@blueprintjs/core";
import LayoutMain from "./LayoutMain.js";
import { version } from "../../../package.json";

const browserData = browserInfo();

export default () => (
    <LayoutMain title="About">
        <div className={Classes.RUNNING_TEXT}>
            <h3>Buttercup</h3>
            <p>
                Buttercup is a password management and security platform, built to be an easy-to-use, free and
                highly-secure tool for all users. Security is important for everyone and{" "}
                <strong>free security must be the baseline</strong> so that everyone can be sure that their identities
                and secrets are safe.
            </p>
            <p>
                The Buttercup suite boasts apps for every major platform so that users can access their content
                anywhere. This extension is a part of that ecosystem and you can use it to assist you in your daily
                activities.
            </p>
            <h3>This browser extension</h3>
            <p>
                The Buttercup browser extension provides access to your encrypted archives so that you can use their
                details when logging in to your accounts. Buttercup will do its best to recognise which site you're
                browsing and can suggest possible logins for it.
            </p>
            <p>
                When presented with a login form, <strong>Buttercup will attach login buttons</strong> to help you log
                in to the service without having to remember any complex passwords. Keep your master password safe and
                let Buttercup protect your accounts with highly secure complex pass phrases.
            </p>
            <h3>Version and info</h3>
            <dl>
                <dt>Version</dt>
                <dd>{version}</dd>
                <dt>Browser</dt>
                <dd>
                    <With infoKeys={Object.keys(browserData)}>
                        <For each="infoKey" of={infoKeys}>
                            <strong>{infoKey}</strong>: {browserData[infoKey]}
                            <br />
                        </For>
                    </With>
                </dd>
            </dl>
        </div>
    </LayoutMain>
);
