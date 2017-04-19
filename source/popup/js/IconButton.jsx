import React from "react";
import PropTypes from "prop-types";

import "IconButton.sass";

class IconButton extends React.Component {

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
                { this.props.children }
            </button>
        );
    }

}

IconButton.propTypes = {
    children: PropTypes.element.isRequired
};

export default IconButton;
