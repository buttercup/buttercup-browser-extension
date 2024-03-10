import React, { Fragment, useCallback, useState } from "react";
import styled from "styled-components";
import { Classes, Divider, Icon, Intent, Tab, Tabs } from "@blueprintjs/core";
import { VaultsPage, VaultsPageControls } from "../pages/VaultsPage.js";
import { EntriesPage, EntriesPageControls } from "../pages/EntriesPage.js";
import { getToaster } from "../../../shared/services/notifications.js";
import { localisedErrorMessage } from "../../../shared/library/error.js";
import { t } from "../../../shared/i18n/trans.js";
import { clearDesktopConnectionAuth, initiateDesktopConnectionRequest } from "../../queries/desktop.js";
import { createNewTab, getExtensionURL } from "../../../shared/library/extension.js";
import { PopupPage } from "../../types.js";
import { OTPsPage } from "../pages/OTPsPage.js";
import { SettingsPage } from "../pages/SettingsPage.js";

interface NavigatorProps {
    activeTab: PopupPage;
    onChangeTab: (tab: PopupPage) => void;
    tabs: Array<PopupPage>;
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 3px;
    overflow: hidden;
    max-height: 100%;

    .${Classes.TAB} {
        outline: none;
        user-select: none;
    }

    .${Classes.TABS} {
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: stretch;
    }

    .${Classes.TAB_PANEL} {
        margin-top: 8px;
        overflow-x: hidden;
        overflow-y: scroll;
    }

    .${Classes.TAB_LIST} {
        padding: 0px 5px;
        height: 30px;
    }
`;

export function Navigator(props: NavigatorProps) {
    const [entriesSearch, setEntriesSearch] = useState<string>("");
    const handleConnectClick = useCallback(async () => {
        try {
            await initiateDesktopConnectionRequest();
            await createNewTab(getExtensionURL("full.html#/connect"));
        } catch (err) {
            console.error(err);
            getToaster().show({
                intent: Intent.DANGER,
                message: t("popup.connection.open-error", { message: localisedErrorMessage(err) }),
                timeout: 10000
            });
        }
    }, []);
    const handleReconnectClick = useCallback(async () => {
        try {
            await clearDesktopConnectionAuth();
        } catch (err) {
            console.error(err);
            getToaster().show({
                intent: Intent.DANGER,
                message: t("popup.connection.reauth-error", { message: localisedErrorMessage(err) }),
                timeout: 10000
            });
            return;
        }
        await handleConnectClick();
    }, [handleConnectClick]);
    return (
        <Container>
            <Tabs
                onChange={(newTab: PopupPage) => props.onChangeTab(newTab)}
                selectedTabId={props.activeTab}
            >
                {props.tabs.map((tabType: PopupPage, ind: number) => (
                    (tabType === PopupPage.Entries && (
                        <Tab
                            key={`tab-${ind}-${tabType}`}
                            id={PopupPage.Entries}
                            panel={(
                                <>
                                    <Divider />
                                    <EntriesPage
                                        onConnectClick={handleConnectClick}
                                        onReconnectClick={handleReconnectClick}
                                        searchTerm={entriesSearch}
                                    />
                                </>
                            )}
                        >
                            <Icon icon="label" title={t("popup.tab.entries.title")} />
                        </Tab>
                    )) ||
                    (tabType === PopupPage.Vaults && (
                        <Tab
                            key={`tab-${ind}-${tabType}`}
                            id={PopupPage.Vaults}
                            panel={(
                                <>
                                    <Divider />
                                    <VaultsPage
                                        onConnectClick={handleConnectClick}
                                        onReconnectClick={handleReconnectClick}
                                    />
                                </>
                            )}
                        >
                            <Icon icon="projects" title={t("popup.tab.vaults.title")} />
                        </Tab>
                    )) ||
                    (tabType === PopupPage.OTPs && (
                        <Tab
                            key={`tab-${ind}-${tabType}`}
                            id={PopupPage.OTPs}
                            panel={(
                                <>
                                    <Divider />
                                    <OTPsPage
                                        onConnectClick={handleConnectClick}
                                        onReconnectClick={handleReconnectClick}
                                        searchTerm={entriesSearch}
                                    />
                                </>
                            )}
                        >
                            <Icon icon="array-timestamp" title={t("popup.tab.otps.title")} />
                        </Tab>
                    )) ||
                    (tabType === PopupPage.Settings && (
                        <Tab
                            key={`tab-${ind}-${tabType}`}
                            id={PopupPage.Settings}
                            panel={(
                                <>
                                    <Divider />
                                    <SettingsPage />
                                </>
                            )}
                        >
                            <Icon icon="cog" title={t("popup.tab.settings.title")} />
                        </Tab>
                    ))
                ))}
                <Tabs.Expander />
                {props.activeTab === PopupPage.Entries && (
                    <EntriesPageControls
                        onSearchTermChange={setEntriesSearch}
                        searchTerm={entriesSearch}
                    />
                )}
                {props.activeTab === PopupPage.Vaults && (
                    <VaultsPageControls />
                )}
            </Tabs>
        </Container>
    );
}
