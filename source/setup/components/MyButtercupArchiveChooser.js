import React, { Component } from "react";
import PropTypes from "prop-types";
import FontAwesome from "react-fontawesome";
import styled from "styled-components";

const ORG_TYPE_PERSONAL = "personal";
const ORG_TYPE_TEAM = "team;";

const OrgnanisationShape = PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf([ORG_TYPE_PERSONAL, ORG_TYPE_TEAM]).isRequired
});

const Container = styled.div`
    border: 1px solid #eee;
    border-radius: 4px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
`;
const OrganisationRow = styled.div`
    width: 100%;
    height: 60px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;
const OrganisationIcon = styled.div`
    width: 38px;
    height: 38px;
    border-radius: 19px;
    overflow: hidden;
    background-color: ${props => (props.own ? "rgb(255, 189, 189)" : "rgb(201, 201, 255)")};
    margin-left: 10px;
    font-size: 20px;
    color: #fff;
`;
const OrganisationTitle = styled.span`
    font-size: 16px;
    flex-grow: 2;
    margin-left: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

class MyButtercupArchiveChooser extends Component {
    static propTypes = {
        disabled: PropTypes.bool.isRequired,
        onReady: PropTypes.func.isRequired,
        organisations: PropTypes.arrayOf(OrgnanisationShape).isRequired
    };

    componentWillMount() {
        this.props.onReady();
    }

    render() {
        return (
            <Container>
                <For each="organisation" of={this.props.organisations}>
                    <OrganisationRow key={`org-${organisation.id}`}>
                        <OrganisationIcon own={organisation.type === ORG_TYPE_PERSONAL}>
                            <Choose>
                                <When condition={organisation.type === ORG_TYPE_PERSONAL}>
                                    <FontAwesome name="user" />
                                </When>
                                <When condition={organisation.type === ORG_TYPE_TEAM}>
                                    <FontAwesome name="users" />
                                </When>
                            </Choose>
                        </OrganisationIcon>
                        <OrganisationTitle>{organisation.name}</OrganisationTitle>
                    </OrganisationRow>
                </For>
            </Container>
        );
    }
}

export default MyButtercupArchiveChooser;
