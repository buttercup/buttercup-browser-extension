import styled from "styled-components";

export const FormButtonContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    > * {
        margin-left: 12px;
    }
`;

export const FormContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

export const FormLegendItem = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 250px;
`;

export const FormRow = styled.div`
    margin-left: 30px;
    width: calc(100% - 40px);
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-content: stretch;
    align-items: center;
    min-height: 56px;
`;

export const FormInputItem = styled.div`
    flex-grow: 2;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 10px;
    width: 100%;
    border-left: 1px solid #eee;
    min-height: 56px;
`;
