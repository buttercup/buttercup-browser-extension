import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Card as CardBase, H4, H5, Classes, Button, Intent, ButtonGroup } from "@blueprintjs/core";

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    padding: 2rem;
`;
const Card = styled(CardBase)`
    flex: 1;
    flex-direction: column;
    display: flex;
`;
const CardBody = styled.div`
    flex: 1;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;
const CardFooter = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1rem;
`;

class SaveNewCredentialsPage extends Component {
    static propTypes = {
        cancelSavingCredentials: PropTypes.func.isRequired,
        fetchCredentials: PropTypes.func.isRequired,
        openSaveForm: PropTypes.func.isRequired
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
        this.props.openSaveForm();
    }

    render() {
        return (
            <Container>
                <Card interactive>
                    <CardBody>
                        <H4>Save in Buttercup?</H4>
                        <H5 className={Classes.TEXT_MUTED}>{this.state.credentialsTitle}</H5>
                    </CardBody>
                    <CardFooter>
                        <Button
                            fill
                            text="Save"
                            icon="floppy-disk"
                            onClick={::this.handleSaveClick}
                            intent={Intent.PRIMARY}
                        />
                        <Button fill text="Cancel" onClick={::this.handleCancelClick} />
                    </CardFooter>
                </Card>
            </Container>
        );
    }
}

export default SaveNewCredentialsPage;
