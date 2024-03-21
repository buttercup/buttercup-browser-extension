import React from "react";
import { Classes, Overlay, H4, Spinner, Text } from "@blueprintjs/core";
import styled from "styled-components";
import cn from "classnames";

interface BusyLoaderProps {
    description: string;
    title: string;
}

const OverlayBody = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`;
const OverlayContainer = styled(Overlay)`
    display: flex;
    justify-content: center;
    align-items: center;
`;

export function BusyLoader(props: BusyLoaderProps) {
    return (
        <OverlayContainer
            canEscapeKeyClose={false}
            canOutsideClickClose={false}
            className={Classes.OVERLAY_SCROLL_CONTAINER}
            hasBackdrop
            isOpen
        >
            <OverlayBody className={cn(Classes.CARD, Classes.ELEVATION_2)}>
                <Spinner size={30} />
                <br />
                <H4>{props.title}</H4>
                <Text>{props.description}</Text>
            </OverlayBody>
        </OverlayContainer>
    );
}
