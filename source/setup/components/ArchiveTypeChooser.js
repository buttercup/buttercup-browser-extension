import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Button, ButtonGroup, Text, Classes } from "@blueprintjs/core";

export const ARCHIVE_TYPES = [
    {
        type: "dropbox",
        title: "Dropbox",
        image: require("../../../resources/providers/dropbox-256.png")
    },
    {
        type: "owncloud",
        title: "ownCloud",
        image: require("../../../resources/providers/owncloud-256.png")
    },
    {
        type: "nextcloud",
        title: "Nextcloud",
        image: require("../../../resources/providers/nextcloud-256.png")
    },
    {
        type: "webdav",
        title: "WebDAV",
        image: require("../../../resources/providers/webdav-256.png")
    },
    {
        type: "localfile",
        title: "Local",
        image: require("../../../resources/providers/local-256.png")
    }
];

const ArchiveTypeImage = styled.img`
    width: 2rem;
    height: 2rem;
    ${p => (p.darkMode ? "filter: brightness(0) invert(1);" : "")};
`;
const VaultContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

class ArchiveTypeChooser extends PureComponent {
    static propTypes = {
        disabled: PropTypes.bool.isRequired,
        darkMode: PropTypes.bool,
        selectedArchiveType: PropTypes.string,
        onSelectArchiveType: PropTypes.func.isRequired
    };

    static defaultProps = {
        disabled: false
    };

    handleArchiveTypeSelection(providerType) {
        if (!this.props.disabled) {
            this.props.onSelectArchiveType(providerType);
        }
    }

    render() {
        return (
            <ButtonGroup fill large minimal>
                <For each="provider" of={ARCHIVE_TYPES}>
                    <Button
                        key={provider.type}
                        onClick={() => this.handleArchiveTypeSelection(provider.type)}
                        active={this.props.selectedArchiveType === provider.type}
                        disabled={this.props.disabled}
                        icon={
                            <VaultContainer>
                                <ArchiveTypeImage darkMode={this.props.darkMode} src={provider.image} />{" "}
                                <Text className={Classes.TEXT_MUTED}>{provider.title}</Text>
                            </VaultContainer>
                        }
                    />
                </For>
            </ButtonGroup>
        );
    }
}

export default ArchiveTypeChooser;
