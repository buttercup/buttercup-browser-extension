import styled from "styled-components";

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: ${p => p.theme.backgroundColor};
`;

export default Container;
