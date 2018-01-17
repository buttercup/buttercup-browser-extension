import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import LayoutMain from "./LayoutMain.js";
import SearchBar from "../containers/SearchBar.js";
import SearchResults from "../containers/SearchResults.js";

const FullSizeNotice = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;
const MessageHeader = styled.div`
    font-size: 18px;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 16px;
`;
const Message = styled.div`
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    width: 80%;
    text-align: center;
`;

class SearchPage extends Component {
    static propTypes = {
        availableSources: PropTypes.number.isRequired,
        onPrepareFirstResults: PropTypes.func.isRequired
    };

    componentWillMount() {
        this.props.onPrepareFirstResults();
    }

    render() {
        return (
            <LayoutMain>
                <Choose>
                    <When condition={this.props.availableSources > 0}>
                        <SearchBar />
                        <SearchResults />
                    </When>
                    <Otherwise>
                        <FullSizeNotice>
                            <MessageHeader>No unlocked archives</MessageHeader>
                            <Message>
                                No archives are currently available/unlocked. Why not get started by adding one?
                            </Message>
                        </FullSizeNotice>
                    </Otherwise>
                </Choose>
            </LayoutMain>
        );
    }
}

export default SearchPage;
