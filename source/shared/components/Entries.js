import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Divider } from "@blueprintjs/core";
import { EntriesShape } from "../prop-types/entry.js";
import Entry from "./Entry.js";

const ScrollList = styled.div`
    max-height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
`;

class Entries extends PureComponent {
    render() {
        const { entries, onSelectEntry, autoLoginEnabled = true } = this.props;
        return (
            <ScrollList>
                {entries.map((entry, ind) => (
                    <div key={entry.id}>
                        {ind === 0 && <Divider />}
                        <Entry
                            copyValue={this.props.copyValue}
                            entry={entry}
                            icons={this.props.icons}
                            onSelectEntry={onSelectEntry}
                            autoLoginEnabled={autoLoginEnabled}
                        />
                        <Divider />
                    </div>
                ))}
            </ScrollList>
        );
    }
}

Entries.defaultProps = {
    copyValue: () => {}
};

Entries.propTypes = {
    copyValue: PropTypes.func.isRequired,
    entries: EntriesShape,
    icons: PropTypes.bool,
    sourcesUnlocked: PropTypes.number,
    autoLoginEnabled: PropTypes.bool,
    onSelectEntry: PropTypes.func.isRequired
};

export default Entries;
