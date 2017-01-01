'use strict';

const React = require("react");

require("IconButton.sass");

class IconButton extends React.Component {

    // buttonClicked(event) {
    //     event.preventDefault();
    //     if (this.props.onClick) {
    //         this.props.onClick(event);
    //     }
    // }

    render() {
        let renderProps = Object.assign({}, this.props);
        renderProps.className = (renderProps.className || "")
            .replace(/\s+/, " ")
            .split(" ")
            .concat(["iconButton", "bttn-material-circle", "bttn-fill", "bttn-sm"])
            .join(" ");
        delete renderProps.children;
        return (
            <button tabIndex="-1" {...renderProps}>
                {this.props.children}
            </button>
        );
    }

}

module.exports = IconButton;
