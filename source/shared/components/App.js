import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Classes } from "@blueprintjs/core";
import { ThemeProvider } from "styled-components";
import Container from "../components/Container.js";
import themes from "../themes.js";

const App = ({ children, darkMode, noBackgroundColor }) => (
    <ThemeProvider theme={darkMode ? themes.dark : themes.light}>
        <Container className={Classes.DARK} noBackgroundColor={noBackgroundColor}>
            {children}
        </Container>
    </ThemeProvider>
);

App.propTypes = {
    darkMode: PropTypes.bool,
    noBackgroundColor: PropTypes.bool
};

export default App;
