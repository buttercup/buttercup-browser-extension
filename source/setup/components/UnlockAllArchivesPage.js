import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { FormGroup, InputGroup, Button, ControlGroup } from "@blueprintjs/core";
import Dialog from "./Dialog.js";
import LayoutMain from "./LayoutMain.js";
import { closeCurrentTab } from "../../shared/library/extension.js";
import ReleaseNotes from "../containers/ReleaseNotes.js";

const DualColumnLayout = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    @media (max-width: 1040px) {
        flex-wrap: wrap;
    }
`;
const PasswordRow = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 30px;
`;
const PasswordLabel = styled.label`
    margin-right: 6px;
`;
const ButtonsRow = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;

    > * {
        margin-left: 12px;
    }
`;

const ArchiveShape = PropTypes.shape({
    title: PropTypes.string.isRequired,
    sourceID: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired
});

class UnlockAllArchivesPage extends Component {
    static propTypes = {
        archives: PropTypes.arrayOf(ArchiveShape).isRequired,
        onUnlockArchive: PropTypes.func.isRequired
    };

    state = {
        masterPasswords: {},
        unlocking: []
    };

    componentDidMount() {
        setTimeout(() => {
            this.focusNextInput();
        }, 100);
    }

    componentWillReceiveProps(nextProps) {
        const lockedCountCurrent = this.props.archives.reduce(
            (total, ar) => total + (ar.state === "locked" ? 1 : 0),
            0
        );
        if (nextProps.archives && nextProps.archives.length > 0) {
            const nextLockedCount = nextProps.archives.reduce(
                (total, ar) => total + (ar.state === "locked" ? 1 : 0),
                0
            );
            if (nextLockedCount > 0 && nextLockedCount !== lockedCountCurrent) {
                setTimeout(() => {
                    this.focusNextInput();
                }, 350);
            }
        }
    }

    focusNextInput() {
        if (this._passwordInput) {
            this._passwordInput.focus();
        }
    }

    handleUnlockArchive(event, sourceID) {
        if (event) {
            event.preventDefault();
        }
        this.setState({ unlocking: [...this.state.unlocking, sourceID] }, () => {
            this.props.onUnlockArchive(sourceID, this.state.masterPasswords[sourceID]).then(unlocked => {
                this.setState({
                    unlocking: this.state.unlocking.filter(id => id !== sourceID)
                });
            });
        });
    }

    handleUpdatePassword(event, sourceID) {
        this.setState({
            masterPasswords: {
                ...this.state.masterPasswords,
                [sourceID]: event.target.value
            }
        });
    }

    onInputKeyPress(event, sourceID) {
        if (event.key === "Enter") {
            this.handleUnlockArchive(undefined, sourceID);
        }
    }

    render() {
        const firstLockedIndex = this.props.archives.findIndex(archive => archive.state === "locked");
        return (
            <DualColumnLayout>
                <Dialog title="Unlock archives" overlay={false}>
                    <For each="archive" of={this.props.archives} index="archiveIndex">
                        <With
                            unlocking={this.state.unlocking.includes(archive.sourceID)}
                            unlocked={archive.state === "unlocked"}
                        >
                            <FormGroup
                                label={`Unlock "${archive.name}"`}
                                disabled={unlocked}
                                helperText={unlocked ? "Vault is unlocked." : null}
                                key={`archive-${archive.sourceID}`}
                            >
                                <ControlGroup fill>
                                    <InputGroup
                                        fill
                                        placeholder="Enter master password..."
                                        type="password"
                                        disabled={unlocked}
                                        onChange={event => this.handleUpdatePassword(event, archive.sourceID)}
                                        value={this.state.masterPasswords[archive.sourceID] || ""}
                                        onKeyPress={event => this.onInputKeyPress(event, archive.sourceID)}
                                        inputRef={input => {
                                            if (archiveIndex === firstLockedIndex) {
                                                this._passwordInput = input;
                                            }
                                        }}
                                    />
                                    <Button
                                        onClick={event => this.handleUnlockArchive(event, archive.sourceID)}
                                        loading={unlocking}
                                        disabled={unlocked}
                                        text="Unlock"
                                    />
                                </ControlGroup>
                            </FormGroup>
                        </With>
                    </For>
                </Dialog>
                <ReleaseNotes />
            </DualColumnLayout>
        );
    }
}

export default UnlockAllArchivesPage;
