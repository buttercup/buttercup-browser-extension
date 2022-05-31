import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Classes } from "@blueprintjs/core";
import { ThemeProvider } from "styled-components";
import { themes } from "@buttercup/ui";
import Container from "../components/Container.js";
import themesInternal from "../themes.js";

const App = ({ children, darkMode, noBackgroundColor }) => (
    <ThemeProvider
        theme={{
            ...(darkMode ? themesInternal.dark : themesInternal.light),
            ...(darkMode ? themes.dark : themes.light)
        }}
    >
        <Container className={darkMode ? Classes.DARK : null}>{children}</Container>
    </ThemeProvider>
);

App.propTypes = {
    darkMode: PropTypes.bool,
    noBackgroundColor: PropTypes.bool
};

export default App;
