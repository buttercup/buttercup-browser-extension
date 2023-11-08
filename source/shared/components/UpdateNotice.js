import { Colors } from "@blueprintjs/core";
import React, { useCallback } from "react";
import styled from "styled-components";
import { createNewTab, getExtensionURL } from "../library/extension";

const Notice = styled.a`
    position: fixed;
    top: 0px;
    right: 0px;
    left: 0px;
    padding: 6px 4px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: ${Colors.ORANGE2};
    color: ${Colors.WHITE} !important;
`;

export function UpdateNotice() {
    const handleNoticeClick = useCallback(evt => {
        evt.preventDefault();
        createNewTab(getExtensionURL("setup.html#/update"));
    }, []);
    return (
        <Notice href="#" onClick={handleNoticeClick}>
            A new major update will soon be available: It will change how you use this browser extension. Read more
            here.
        </Notice>
    );
}
