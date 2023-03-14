import React, { useState } from "react";
import styled from "styled-components";
import { Classes, Divider, Icon, Tab, Tabs } from "@blueprintjs/core";
import { VaultsPage, VaultsPageControls } from "../pages/VaultsPage.js";
import { EntriesPage, EntriesPageControls } from "../pages/EntriesPage.js";
import { PopupPage } from "../../types.js";

interface NavigatorProps {
    activeTab: PopupPage;
    onChangeTab: (tab: PopupPage) => void;
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
        // display: flex;
        // flex-direction: column;
        // justify-content: space-between;
        // align-items: stretch;
    }

    .${Classes.TAB_LIST} {
        padding: 0px 5px;
        height: 30px;
    }
`;

export function Navigator(props: NavigatorProps) {
    const [entriesSearch, setEntriesSearch] = useState<string>("");
    return (
        <Container>
            <Tabs
                onChange={(newTab: PopupPage) => props.onChangeTab(newTab)}
                selectedTabId={props.activeTab}
            >
                <Tab
                    id={PopupPage.Entries}
                    panel={(
                        <>
                            <Divider />
                            <EntriesPage searchTerm={entriesSearch} />
                        </>
                    )}
                >
                    <Icon icon="label" />
                </Tab>
                <Tab
                    id={PopupPage.Vaults}
                    panel={(
                        <>
                            <Divider />
                            <VaultsPage />
                        </>
                    )}
                >
                    <Icon icon="projects" />
                </Tab>
                <Tab id={PopupPage.OTPs}>
                    <Icon icon="array-timestamp" />
                </Tab>
                <Tab
                    id={PopupPage.Settings}
                    panel={(
                        <>
                            <div>Test</div>
                        </>
                    )}
                >
                    <Icon icon="cog" />
                </Tab>
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
            {/* <BarContents> */}
                {/* <Tabs
                    onChange={(newTab: PopupPage) => props.onChangeTab(newTab)}
                    selectedTabId={props.activeTab}
                >
                    <Tab id={PopupPage.Entries}>Entries</Tab>
                    <Tab id={PopupPage.Vaults}>
                        <VaultsPage />
                    </Tab>
                    <Tab id={PopupPage.OTPs}>OTPs</Tab>
                </Tabs> */}
            {/* </BarContents> */}
            {/* <Divider /> */}
        </Container>
    );
}
