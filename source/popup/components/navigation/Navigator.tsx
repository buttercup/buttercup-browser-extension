import React from "react";
import styled from "styled-components";
import { Classes, Divider, Tab, Tabs } from "@blueprintjs/core";
import { VaultsPage, VaultsPageControls } from "../pages/VaultsPage.js";
import { PopupPage } from "../../types.js";

interface NavigatorProps {
    activeTab: PopupPage;
    onChangeTab: (tab: PopupPage) => void;
}

// const BarContents = styled.div`
//     display: flex;
//     flex-direction: row;
//     justify-content: space-between;
//     align-items: center;
//     padding: 0px 3px;
// `;
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 3px;

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
                <Tab id={PopupPage.Entries}>Entries</Tab>
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
                <Tab id={PopupPage.OTPs}>OTPs</Tab>
                <Tabs.Expander />
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
