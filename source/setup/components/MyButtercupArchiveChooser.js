import React, { Component } from "react";
import PropTypes from "prop-types";
import FontAwesome from "react-fontawesome";
import styled from "styled-components";

const ARCHIVE_TYPE_NORMAL = "normal";
const BUTTERCUP_LOGO_SMALL = require("../../../resources/buttercup-128.png");
const ORG_TYPE_PERSONAL = "personal";
const ORG_TYPE_TEAM = "team;";

const ArchiveShape = PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf([ARCHIVE_TYPE_NORMAL]).isRequired,
    last_update: PropTypes.string.isRequired
});
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
    display: flex;
    justify-content: center;
    align-items: center;
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
`;
const ArchiveRow = styled.div`
    width: calc(100% - 40px);
    height: 40px;
    padding-left: 40px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    user-select: none;

    &:hover {
        background-color: rgba(135, 188, 185, 0.3);
    }
`;
const ArchiveRowCheckbox = styled.div`
    width: 20px;
    height: 20px;
    flex: 0 0 auto;
    color: #33d82d;
`;
const ArchiveRowIcon = styled.div`
    width: 20px;
    height: 20px;
    background-image: url(${BUTTERCUP_LOGO_SMALL});
    background-size: 26px;
    background-position: 50% 50%;
    flex: 0 0 auto;
`;
const ArchiveTitle = styled.span`
    font-size: 14px;
    margin-left: 6px;
`;

class MyButtercupArchiveChooser extends Component {
    static propTypes = {
        disabled: PropTypes.bool.isRequired,
        onReady: PropTypes.func.isRequired,
        organisationArchives: PropTypes.objectOf(PropTypes.arrayOf(ArchiveShape)).isRequired,
        organisations: PropTypes.arrayOf(OrgnanisationShape).isRequired
    };

    state = {
        selectedArchives: []
    };

    componentWillMount() {
        this.props.onReady();
    }

    handleArchiveRowClick(event, archiveID) {
        event.preventDefault();
        if (this.state.selectedArchives.includes(archiveID)) {
            this.setState({
                selectedArchives: this.state.selectedArchives.filter(id => id !== archiveID)
            });
        } else {
            this.setState({
                selectedArchives: [...this.state.selectedArchives, archiveID]
            });
        }
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
                    <If condition={this.props.organisationArchives.hasOwnProperty(`org-${organisation.id}`)}>
                        <For each="archive" of={this.props.organisationArchives[`org-${organisation.id}`]}>
                            <ArchiveRow
                                key={`archive-${archive.id}`}
                                onClick={event => this.handleArchiveRowClick(event, archive.id)}
                            >
                                <ArchiveRowCheckbox>
                                    <If condition={this.state.selectedArchives.includes(archive.id)}>
                                        <FontAwesome name="check" />
                                    </If>
                                </ArchiveRowCheckbox>
                                <ArchiveRowIcon />
                                <ArchiveTitle>{archive.name}</ArchiveTitle>
                            </ArchiveRow>
                        </For>
                    </If>
                </For>
            </Container>
        );
    }
}

export default MyButtercupArchiveChooser;
