import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import EntriesList from "../../shared/components/Entries.js";
import { copyToClipboard } from "../library/messaging.js";

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
        sourcesUnlocked: PropTypes.number.isRequired,
        onEnterDetailsRequest: PropTypes.func.isRequired
    };

    render() {
        return (
            <Container>
                <EntriesList
                    copyValue={value => copyToClipboard(value)}
                    entries={this.props.entries}
                    icons
                    sourcesUnlocked={this.props.sourcesUnlocked}
                    onSelectEntry={this.props.onEnterDetailsRequest}
                />
            </Container>
        );
    }
}

export default SearchResults;
