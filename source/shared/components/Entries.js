import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Divider } from "@blueprintjs/core";
import { EntriesShape } from "../prop-types/entry.js";
import Entry from "./Entry.js";
import { List, AutoSizer } from "react-virtualized";

class Entries extends PureComponent {
    rowRenderer = ({ index, style }) => {
        const { entries, onSelectEntry, autoLoginEnabled = true } = this.props;
        return (
            <div style={style} key={entries[index].id}>
                <Entry
                    entry={entries[index]}
                    icons={this.props.icons}
                    onSelectEntry={onSelectEntry}
                    autoLoginEnabled={autoLoginEnabled}
                />
                <Divider />
            </div>
        );
    };

    render() {
        const { entries } = this.props;
        return (
            <AutoSizer>
                {({ height, width }) => (
                    <List
                        width={width}
                        height={height}
                        rowCount={entries.length}
                        rowHeight={66}
                        rowRenderer={this.rowRenderer}
                        overscanRowCount={10}
                    />
                )}
            </AutoSizer>
        );
    }
}

Entries.propTypes = {
    entries: EntriesShape,
    icons: PropTypes.bool,
    sourcesUnlocked: PropTypes.number,
    autoLoginEnabled: PropTypes.bool,
    onSelectEntry: PropTypes.func.isRequired
};

export default Entries;
