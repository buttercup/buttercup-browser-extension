import React from "react";
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

    [role="tab"] {
        outline: none;
        user-select: none;
    }

    .${Classes.TAB_PANEL} {
        margin-top: 8px;
    }
`;

export function Navigator(props: NavigatorProps) {
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
                            <EntriesPage />
                        </>
                    )}
                >Entries</Tab>
                <Tab
                    id={PopupPage.Vaults}
                    panel={(
                        <>
                            <Divider />
                            <VaultsPage />
                        </>
                    )}
                >
                    Vaults
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
                    <EntriesPageControls />
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
