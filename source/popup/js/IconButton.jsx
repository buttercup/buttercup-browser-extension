'use strict';

const React = require("react");

class IconButton extends React.Component {

    // buttonClicked(event) {
    //     event.preventDefault();
    //     if (this.props.onClick) {
    //         this.props.onClick(event);
    //     }
    // }

    render() {
        return (
            <button {...this.props}>
                {this.props.children}
            </button>
        );
    }

}

module.exports = IconButton;
