import PropTypes from "prop-types";
import styled from "styled-components";

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: ${p => (p.noBackgroundColor ? "transparent" : p.theme.backgroundColor)};
`;

Container.propTypes = {
    noBackgroundColor: PropTypes.bool,
};

export default Container;
