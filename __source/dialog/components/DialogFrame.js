import React from "react";
import styled from "styled-components";

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
    overflow: hidden;
    background-color: ${p => p.theme.backgroundColor};
    box-shadow: inset 0 0 0 1px ${p => p.theme.backgroundFrameColor};
    border-radius: 0 0 3px 3px;
    padding: 0.5rem;
`;

export default Container;
