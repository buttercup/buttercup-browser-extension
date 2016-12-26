"use strict";

const React = require("react");

class ArchiveGroupExplorerNode extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
        this.depth = this.props.depth || 0;
        this.isArchive = this.props.hasOwnProperty("archiveID");
        this.archiveID = (this.isArchive) ? this.props.archiveID : this.props.ownerID;
        this.children = this.props.groups.map(group =>
            <ArchiveGroupExplorerNode
                key={group.groupID}
                depth={this.depth + 1}
                onSelect={this.props.onSelect}
                ownerID={this.archiveID}
                {...group}
                />
        );
    }

    close() {
        this.setState({ open: false });
    }

    onArrowClick(e) {
        e.preventDefault();
        this.toggle();
    }

    onTitleClick(e) {
        e.preventDefault();
        if (this.isArchive) {
            this.toggle();
            return;
        }
        this.props.onSelect({
            id: this.props.groupID,
            title: this.props.title,
            archiveID: this.archiveID
        });
    }

    open() {
        if (this.children.length <= 0) {
            return;
        }
        this.setState({ open: true });
    }

    render() {
        let title = this.props.title || this.props.name,
            arrow = (this.state.open) ? "▼" : "▶",
            marginLeft = this.depth * 20,
            style = {
                marginLeft: `${marginLeft}px`
            },
            className = "explorerNode";
        if (this.children.length <= 0) {
            className += " noChildren";
        }
        return <div className={className} style={style}>
            <span className="arrow" onClick={(e) => this.onArrowClick(e)}>{arrow}</span> 
            <span className="title" onClick={(e) => this.onTitleClick(e)}>{title}</span>
            {this.state.open && this.children}
        </div>;
    }

    toggle() {
        if (this.state.open) {
            this.close();
        } else {
            this.open();
        }
    }

}

module.exports = ArchiveGroupExplorerNode;
