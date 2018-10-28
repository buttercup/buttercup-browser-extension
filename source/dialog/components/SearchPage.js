import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { NonIdealState } from "@blueprintjs/core";
import styled from "styled-components";
import SearchBar from "../containers/SearchBar.js";
import SearchResults from "../containers/SearchResults.js";
import DialogFrame from "./DialogFrame.js";

class SearchPage extends PureComponent {
    static propTypes = {
        availableSources: PropTypes.number.isRequired,
        onPrepareFirstResults: PropTypes.func.isRequired
    };

    componentWillMount() {
        this.props.onPrepareFirstResults();
    }

    render() {
        return (
            <DialogFrame>
                <Choose>
                    <When condition={this.props.availableSources > 0}>
                        <SearchBar />
                        <SearchResults />
                    </When>
                    <Otherwise>
                        <NonIdealState
                            icon="lock"
                            title="No unlocked vaults"
                            description="No vaults are currently available or unlocked. Why not get started by adding one?"
                        />
                    </Otherwise>
                </Choose>
            </DialogFrame>
        );
    }
}

export default SearchPage;
