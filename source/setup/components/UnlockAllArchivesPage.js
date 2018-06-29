import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Input as ButtercupInput, Button as ButtercupButton } from "@buttercup/ui";
import LayoutMain from "./LayoutMain.js";
import { closeCurrentTab } from "../../shared/library/extension.js";

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
                const newState = {
                    unlocking: this.state.unlocking.filter(id => id !== sourceID)
                };
                if (unlocked) {
                    newState.masterPasswords = {
                        ...this.state.masterPasswords,
                        [sourceID]: ""
                    };
                }
                this.setState(newState);
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
            <LayoutMain title="Unlock archives">
                <For each="archive" of={this.props.archives} index="archiveIndex">
                    <If condition={archiveIndex > 0}>
                        <hr />
                    </If>
                    <Choose>
                        <When condition={archive.state === "unlocked"}>
                            <h3>
                                <i>'{archive.title}' is unlocked...</i>
                            </h3>
                        </When>
                        <Otherwise>
                            <With unlocking={this.state.unlocking.includes(archive.sourceID)}>
                                <h3>
                                    <If condition={unlocking}>
                                        <FontAwesome name="cog" spin />&nbsp;
                                    </If>
                                    Unlock '{archive.title}'
                                </h3>
                                <PasswordRow>
                                    <PasswordLabel>Password:</PasswordLabel>
                                    <ButtercupInput
                                        placeholder="Enter master password..."
                                        type="password"
                                        disabled={unlocking}
                                        onChange={event => this.handleUpdatePassword(event, archive.sourceID)}
                                        value={this.state.masterPasswords[archive.sourceID] || ""}
                                        onKeyPress={event => this.onInputKeyPress(event, archive.sourceID)}
                                        innerRef={input => {
                                            if (archiveIndex === firstLockedIndex) {
                                                this._passwordInput = input;
                                            }
                                        }}
                                    />
                                </PasswordRow>
                                <ButtonsRow>
                                    <ButtercupButton
                                        onClick={event => this.handleUnlockArchive(event, archive.sourceID)}
                                        disabled={unlocking}
                                    >
                                        Unlock
                                    </ButtercupButton>
                                </ButtonsRow>
                            </With>
                        </Otherwise>
                    </Choose>
                </For>
            </LayoutMain>
        );
    }
}

export default UnlockAllArchivesPage;
