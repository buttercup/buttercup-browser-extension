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
        cancelSavingCredentials: PropTypes.func.isRequired,
        fetchCredentials: PropTypes.func.isRequired
    };

    state = {
        credentialsTitle: "\u2026"
    };

    componentDidMount() {
        this.props.fetchCredentials().then(details => {
            this.setState({
                credentialsTitle: details.title
            });
        });
    }

    handleCancelClick(event) {
        event.preventDefault();
        this.props.cancelSavingCredentials();
    }

    handleSaveClick(event) {
        event.preventDefault();
    }

    render() {
        return (
            <LayoutMain>
                <Container>
                    <SaveHeading>Save new login?</SaveHeading>
                    <ItemTitle>"{this.state.credentialsTitle}"</ItemTitle>
                    <ButtonsContainer>
                        <Button onClick={::this.handleSaveClick}>
                            <FontAwesome name="save" /> Save
                        </Button>
                        <Button onClick={::this.handleCancelClick}>Cancel</Button>
                    </ButtonsContainer>
                </Container>
            </LayoutMain>
        );
    }
}

export default SaveNewCredentialsPage;
