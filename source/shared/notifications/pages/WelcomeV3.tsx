import { Fragment } from "react";
import { t } from "../../i18n/trans.js";

export const TITLE = "notifications.page.welcome-v3.title";

export function Page() {
    return (
        <Fragment>
            <p dangerouslySetInnerHTML={{ __html: t("notifications.page.welcome-v3.line-1") }} />
            <p dangerouslySetInnerHTML={{ __html: t("notifications.page.welcome-v3.line-2") }} />
            <p dangerouslySetInnerHTML={{ __html: t("notifications.page.welcome-v3.line-3") }} />
            <p>- The Buttercup Team</p>
        </Fragment>
    );
}
