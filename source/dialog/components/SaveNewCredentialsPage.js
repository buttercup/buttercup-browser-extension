import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import FontAwesome from "react-fontawesome";
import { Button } from "@buttercup/ui";
import LayoutMain from "./LayoutMain.js";

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: top;
    align-items: center;
    flex-direction: column;
`;
const SaveHeading = styled.span`
    font-size: 18px;
    margin-top: 20px;
`;
const ItemTitle = styled.span`
    margin-top: 12px;
    width: 80%;
    height: 40px;
    font-style: italic;
    text-align: center;
`;
const ButtonsContainer = styled.div`
    margin-top: 18px;
    width: 60%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
`;

class SaveNewCredentialsPage extends Component {
    static propTypes = {
        credentialsTitle: PropTypes.string.isRequired
    };

    render() {
        return (
            <LayoutMain>
                <Container>
                    <SaveHeading>Save new login?</SaveHeading>
                    <ItemTitle>"Developer Dashboard - Chrome Web Store"</ItemTitle>
                    <ButtonsContainer>
                        <Button>
                            <FontAwesome name="save" /> Save
                        </Button>
                        <Button>Cancel</Button>
                    </ButtonsContainer>
                </Container>
            </LayoutMain>
        );
    }
}

export default SaveNewCredentialsPage;
