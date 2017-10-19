import React from "react";

const { PropTypes } = React;

class App extends React.Component {
    render() {
        return (
            <main>
                {this.props.children}
            </main>
        );
    }

}

App.propTypes = {
    children: PropTypes.element.isRequired
};

export default App;
