import React from "react";
import styled from "styled-components";
import { Button, ButtonGroup } from "@blueprintjs/core";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
`;

export function VaultsPage() {
    return (
        <Container>
            Vaults
        </Container>
    );
}

export function VaultsPageControls() {
    return (
        <ButtonGroup>
            <Button
                icon="add"
                minimal
            />
            <Button
                icon="lock"
                minimal
            />
        </ButtonGroup>
    );
}
