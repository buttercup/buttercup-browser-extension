import { Button, ButtonGroup, Divider } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
`;
const MenuBar = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
`;
const MenuItems = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
`;

export function VaultsPage() {
    return (
        <Container>
            Vaults
            {/* <MenuBar>
                <MenuItems>
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
                </MenuItems>
                <Divider />
            </MenuBar> */}
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
