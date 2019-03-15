import React, { Component } from "react";
import PropTypes from "prop-types";
import { VaultProvider, VaultUI } from "@buttercup/ui";

// @TODO maybe move this somewhere better?
import "@buttercup/ui/dist/styles.css";

class VaultPage extends Component {
    static propTypes = {
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
            <div>
                <Choose>
                    <When condition={this.props.vault}>
                        <VaultProvider vault={this.props.vault} onUpdate={() => {}}>
                            <VaultUI />
                        </VaultProvider>
                    </When>
                    <Otherwise>
                        <i>Loading...</i>
                    </Otherwise>
                </Choose>
            </div>
        );
    }
}

export default VaultPage;
