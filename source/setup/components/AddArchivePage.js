import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Input as ButtercupInput, Button as ButtercupButton } from "@buttercup/ui";
import LayoutMain from "./LayoutMain.js";
import ArchiveTypeChooser from "../containers/ArchiveTypeChooser.js";

const SubSection = styled.div`
    width: 100%;
    margin-top: 30px;
`;
const FormContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;
const FormRow = styled.div`
    margin-left: 30px;
    width: calc(100% - 40px);
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-content: stretch;
    align-items: center;
    height: 56px;
`;
const FormLegendItem = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 250px;
`;
const FormInputItem = styled.div`
    flex-grow: 2;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 10px;
    width: 100%;
    border-left: 1px solid #eee;
    height: 56px;
`;
const ButtonContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;

class AddArchivePage extends Component {
    static propTypes = {
        selectedArchiveType: PropTypes.string
    };

    render() {
        return (
            <LayoutMain title="Add Archive">
                <h3>Choose Archive Type</h3>
                <ArchiveTypeChooser />
                <If condition={this.props.selectedArchiveType}>
                    {this.renderConnectionInfo()}
                </If>
            </LayoutMain>
        );
    }

    renderConnectionInfo() {
        return (
            <SubSection>
                <h3>Enter Connection Details</h3>
                <Choose>
                    <When condition={this.props.selectedArchiveType === "webdav"}>
                        <FormContainer>
                            <FormRow>
                                <FormLegendItem>WebDAV URL</FormLegendItem>
                                <FormInputItem>
                                    <ButtercupInput
                                        placeholder="Enter remote URL..."
                                    />
                                </FormInputItem>
                            </FormRow>
                            <FormRow>
                                <FormLegendItem>WebDAV Username</FormLegendItem>
                                <FormInputItem>
                                    <ButtercupInput
                                        placeholder="Enter WebDAV username..."
                                    />
                                </FormInputItem>
                            </FormRow>
                            <FormRow>
                                <FormLegendItem>WebDAV Password</FormLegendItem>
                                <FormInputItem>
                                    <ButtercupInput
                                        placeholder="Enter WebDAV password..."
                                        type="password"
                                    />
                                </FormInputItem>
                            </FormRow>
                        </FormContainer>
                        <ButtonContainer>
                            <ButtercupButton>Connect</ButtercupButton>
                        </ButtonContainer>
                    </When>
                    <Otherwise>
                        <i>Unsupported archive type.</i>
                    </Otherwise>
                </Choose>
            </SubSection>
        );
    }
}

export default AddArchivePage;
