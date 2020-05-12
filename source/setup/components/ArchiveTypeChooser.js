import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Button, ButtonGroup, Text, Classes } from "@blueprintjs/core";
import { VAULT_TYPES } from "../../shared/library/icons.js";

const ArchiveTypeImage = styled.img`
    width: 2rem;
    height: 2rem;
    ${p => (p.darkMode && p.invertOnDarkMode ? "filter: brightness(0) invert(1);" : "")} ${p =>
        p.disabled ? "opacity: 0.4;" : ""};
`;
const ArchiveText = styled(Text)`
    ${p => (p.disabled ? "opacity: 0.4;" : "")};
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
                <For each="provider" of={VAULT_TYPES}>
                    <With disabled={!!(this.props.disabled || provider.disabled)}>
                        <Button
                            key={provider.type}
                            onClick={() => this.handleArchiveTypeSelection(provider.type)}
                            active={this.props.selectedArchiveType === provider.type}
                            disabled={disabled}
                            icon={
                                <VaultContainer title="Coming soon...">
                                    <ArchiveTypeImage
                                        darkMode={this.props.darkMode}
                                        invertOnDarkMode={provider.invertOnDarkMode}
                                        src={provider.image}
                                        disabled={disabled}
                                    />{" "}
                                    <ArchiveText className={Classes.TEXT_MUTED} disabled={disabled}>
                                        {provider.title}
                                    </ArchiveText>
                                </VaultContainer>
                            }
                        />
                    </With>
                </For>
            </ButtonGroup>
        );
    }
}

export default ArchiveTypeChooser;
