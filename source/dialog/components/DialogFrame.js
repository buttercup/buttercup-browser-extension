import React from "react";
import styled from "styled-components";
import { Colors } from "@blueprintjs/core";

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: inset 0 0 0 1px ${Colors.GRAY5};
    border-radius: 0 0 3px 3px;
    padding: 0.5rem;
`;

export default Container;
