import React from "react";
import { Tree } from "@blueprintjs/core";
import { t } from "../../../../shared/i18n/trans.js";

interface CredentialsSaverProps {
    selected: string;
}

export function CredentialsSaver(props: CredentialsSaverProps) {
    return (
        <div>
            <Tree
                contents={[]}
            />
        </div>
    );
}
