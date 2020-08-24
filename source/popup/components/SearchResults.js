import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Button, NonIdealState } from "@blueprintjs/core";
import Entries from "../../shared/components/Entries.js";

import BUTTERCUP_LOGO from '../../../resources/buttercup-standalone.png';

const Container = styled.div`
    flex: 1;
`;

const EntryShape = PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string
});

class SearchResults extends PureComponent {
    static propTypes = {
        entries: PropTypes.arrayOf(EntryShape),
        sourcesTotal: PropTypes.number.isRequired,
        sourcesUnlocked: PropTypes.number.isRequired,
        onAddVault: PropTypes.func.isRequired,
        onSelectEntry: PropTypes.func.isRequired,
        onUnlockAllArchives: PropTypes.func.isRequired
    };

    render() {
        return (
            <Container>
                <Choose>
                    <When condition={this.props.entries.length > 0}>
                        <Entries
                            autoLoginEnabled={true}
                            entries={this.props.entries}
                            onSelectEntry={this.props.onSelectEntry}
                            sourcesUnlocked={this.props.sourcesUnlocked}
                        />
                    </When>
                    <Otherwise>
                        <NonIdealState
                            title="Welcome to Buttercup"
                            description="Use the search bar to find entries in your unlocked vaults."
                            icon={<img src={BUTTERCUP_LOGO} width="64" />}
                            action={
                                this.props.sourcesUnlocked === 0 ? (
                                    this.props.sourcesTotal === 0 ? (
                                        <Button icon="add" onClick={::this.props.onAddVault}>
                                            Add Vault
                                        </Button>
                                    ) : (
                                        <Button icon="unlock" onClick={::this.props.onUnlockAllArchives}>
                                            Unlock Vaults
                                        </Button>
                                    )
                                ) : null
                            }
                        />
                    </Otherwise>
                </Choose>
            </Container>
        );
    }
}

export default SearchResults;
