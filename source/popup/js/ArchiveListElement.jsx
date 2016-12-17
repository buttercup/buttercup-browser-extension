'use strict';

const React = require("react");

const NOPE = function() {};

class ArchiveListElement extends React.Component {

    render() {
        let locked = this.props.locked,
            lockState = (locked) ?
                `(🔒 locked)` : `(🔓 unlocked)`;
        return (
            <div>
                <span className="listEl">{this.props.name} {lockState}</span>
                {locked && <a className="unlockArchive" href="#" onClick={(e) => this.unlockClicked(e)}>(Unlock)</a>}
            </div>
        );
    }

    unlockClicked(e) {
        e.preventDefault();
        chrome.tabs.create({
            'url': chrome.extension.getURL('dist/setup.html#/unlockArchive/' + this.props.name)},
            NOPE
        );
    }

}

module.exports = ArchiveListElement;
