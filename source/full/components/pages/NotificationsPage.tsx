import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { Icon, Intent, Tab, Tabs } from "@blueprintjs/core";
import { NOTIFICATIONS } from "../../../shared/notifications/index.js";
import { Layout } from "../Layout.js";
import { t } from "../../../shared/i18n/trans.js";
import { updateReadNotifications } from "../../services/notifications.js";
import { getToaster } from "../../../shared/services/notifications.js";
import { localisedErrorMessage } from "../../../shared/library/error.js";

export function NotificationsPage() {
    const { notifications: notificationsRaw = "" } = useLoaderData() as {
        notifications: string
    };
    const notificationKeys = useMemo(() => notificationsRaw.split(","), [notificationsRaw]);
    const notifications = useMemo(() => notificationKeys.map(key => NOTIFICATIONS[key]), [notificationKeys]);
    const [currentTab, setCurrentTab] = useState<string | null>(null);
    const [readNotifications, setReadNotifications] = useState<Array<string>>([]);
    const handleTabChange = useCallback((newTabID: string) => {
        setReadNotifications(current => [...new Set([
            ...current,
            newTabID
        ])]);
        setCurrentTab(newTabID);
        const key = Object.keys(NOTIFICATIONS).find(nKey => NOTIFICATIONS[nKey][0] === newTabID);
        updateReadNotifications(key).catch(err => {
            console.error(err);
            getToaster().show({
                intent: Intent.DANGER,
                message: t("error.generic", { message: localisedErrorMessage(err) }),
                timeout: 10000
            });
        });
    }, []);
    useEffect(() => {
        if (currentTab || notifications.length <= 0) return;
        handleTabChange(notifications[0][0]);
    }, [currentTab, handleTabChange, notifications]);
    return (
        <Layout title={t("notifications.title")}>
            <Tabs onChange={handleTabChange} selectedTabId={currentTab}>
                {notifications.map(([nameKey, Component]) => (
                    <Tab
                        key={nameKey}
                        id={nameKey}
                        title={(
                            <span>
                                <Icon icon={readNotifications.includes(nameKey) ? "notifications-updated" : "notifications"} />&nbsp;
                                {t(nameKey)}
                            </span>
                        )}
                        panel={<Component />}
                    />
                ))}
            </Tabs>
        </Layout>
    );
}
