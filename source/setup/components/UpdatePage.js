import React from "react";
import { Classes } from "@blueprintjs/core";
import LayoutUpdate from "./LayoutUpdate.js";

export default () => (
    <LayoutUpdate title="Upcoming Update">
        <div className={Classes.RUNNING_TEXT}>
            <h3>Version 3 Major Update</h3>
            <p>
                We're getting ready to release a new version of this extension, and it's going to change the way that
                you interact with Buttercup in the browser, for the better. It's important that you read this notice to
                understand what's changing, and what will be required to use it once it's released.
            </p>
            <p>
                Google released **version 3** of the extension manifest some time ago, which changes how browser
                extensions can operate within the Chrome browser. As Chrome is a target platform for Buttercup, we need
                to make certain changes to continue supporting it during the migration to version 3 of the{" "}
                <a
                    target="_blank"
                    href="https://developer.chrome.com/docs/extensions/migrating/to-service-workers/#changes-youll-need-to-make"
                >
                    manifest specification
                </a>
                .
            </p>
            <p>
                Due to these changes, Buttercup has had to change from supporting vault management natively, in this
                extension, to using the <strong>Desktop Application</strong> instead. This means that once version 3 of
                this extension has been released, you'll need the Buttercup desktop application installed and running
                for it to work.
            </p>
            <p>
                <i>
                    You do not need to have the desktop window open. You can, on supporting platforms, use the portable
                    application instead.
                </i>
            </p>
            <p>
                While this might seem like an impairment at first, we're confident that it'll actually make the
                extension <i>better</i>. Maintaining so many applications with such a small team is tough, and being
                able to deliver on our quality expectations can be hard when we're stretched thin. Not having to
                maintain a full vault management feature in this extension will mean that we can concentrate on new
                features and improving the quality of our platform instead. Focusing on the desktop application, in
                terms of vault management, will yield benefits for the extension at the same time.
            </p>
            <p>
                If you'd like to follow the discussion on this migration, or participate in it, please take a look at
                one of the{" "}
                <a target="_blank" href="https://github.com/buttercup/buttercup-browser-extension/discussions/451">
                    several threads
                </a>{" "}
                on GitHub, or jump in to{" "}
                <a target="_blank" href="https://keybase.io/team/bcup">
                    Keybase
                </a>{" "}
                to chat with us directly.
            </p>
        </div>
    </LayoutUpdate>
);
