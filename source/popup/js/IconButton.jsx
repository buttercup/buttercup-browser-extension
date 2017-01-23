import React from "react";

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
                {this.props.children}
            </button>
        );
    }

}

export default IconButton;
