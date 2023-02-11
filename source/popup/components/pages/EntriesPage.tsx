import React from "react";
import styled from "styled-components";
import { Button, ButtonGroup, ControlGroup, InputGroup } from "@blueprintjs/core";
import { t } from "../../../shared/i18n/trans.js";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
`;
const Input = styled(InputGroup)`
    margin-right: 2px !important;
`;

export function EntriesPage() {
    return (
        <Container>
            Vaults
        </Container>
    );
}

export function EntriesPageControls() {
    return (
        // <ControlGroup>
        <>
            <Input
                placeholder={t("popup.entries.search.placeholder")}
                round
                // small
            />
            <Button
                icon="search"
                minimal
            />
        </>
        //     <Button
        //         icon="search"
        //         minimal
        //     />
        // </ControlGroup>
    );
}
