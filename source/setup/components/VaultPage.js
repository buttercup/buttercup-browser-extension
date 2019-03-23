import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Spinner } from "@blueprintjs/core";
import { VaultProvider, VaultUI } from "@buttercup/ui";

// @TODO maybe move this somewhere better?
import "@buttercup/ui/dist/styles.css";

const Loader = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

class VaultPage extends Component {
    static propTypes = {
        fetchVaultFacade: PropTypes.func.isRequired,
        saveVaultFacade: PropTypes.func.isRequired,
        sourceID: PropTypes.string.isRequired,
        vault: PropTypes.object
    };

    state = {
        masterPassword: ""
    };

    componentDidMount() {
        this.props.fetchVaultFacade(this.props.sourceID);
    }

    render() {
        return (
            <Choose>
                <When condition={this.props.vault}>
                    <VaultProvider
                        vault={this.props.vault}
                        onUpdate={vault => this.props.saveVaultFacade(this.props.sourceID, vault)}
                    >
                        <VaultUI />
                    </VaultProvider>
                </When>
                <Otherwise>
                    <Loader>
                        <Spinner />
                    </Loader>
                </Otherwise>
            </Choose>
        );
    }
}

export default VaultPage;
