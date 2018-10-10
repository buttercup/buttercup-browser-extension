import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Colors, NonIdealState } from "@blueprintjs/core";
import styled from "styled-components";
import SearchBar from "../containers/SearchBar.js";
import SearchResults from "../containers/SearchResults.js";

const SearchLayout = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.85);
    box-shadow: inset 0 0 0 1px ${Colors.GRAY5};
    border-radius: 3px;
`;

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
            <SearchLayout>
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
            </SearchLayout>
        );
    }
}

export default SearchPage;
