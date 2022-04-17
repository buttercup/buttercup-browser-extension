import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { InputGroup, FormGroup, Switch, HTMLSelect } from "@blueprintjs/core";
import ms from "ms";

const SettingsContainer = styled.div`
    padding: 12px;
    overflow-x: hidden;
    overflow-y: scroll;
`;

export default class SettingsPage extends PureComponent {
    static propTypes = {
        config: PropTypes.object,
        onUpdateConfigValue: PropTypes.func.isRequired
    };

    handleConfigChange(event, configKey) {
        const { target } = event;
        const { onUpdateConfigValue } = this.props;
        if (target.type === "checkbox") {
            onUpdateConfigValue(configKey, target.checked ? true : false);
        } else {
            onUpdateConfigValue(configKey, target.value);
        }
    }

    render() {
        const { config } = this.props;
        return (
            <SettingsContainer>
                <FormGroup label="Dark Theme">
                    <Switch
                        label={config.darkMode ? "Enabled" : "Disabled"}
                        checked={config.darkMode}
                        onChange={event => this.handleConfigChange(event, "darkMode")}
                    />
                </FormGroup>
                <FormGroup label="Vaults Auto Unlock" helperText="Automatically unlock vaults when the browser starts.">
                    <Switch
                        label={config.autoUnlockVaults ? "Enabled" : "Disabled"}
                        checked={config.autoUnlockVaults}
                        onChange={event => this.handleConfigChange(event, "autoUnlockVaults")}
                    />
                </FormGroup>
                <FormGroup label="Vaults Auto Lock" helperText={"Automatically lock vaults after the selected time."}>
                    <HTMLSelect
                        fill
                        value={config.autoLockVaults}
                        options={[
                            { label: "5 minutes", value: ms("5m") },
                            { label: "10 minutes", value: ms("10m") },
                            { label: "15 minutes", value: ms("15m") },
                            { label: "30 minutes", value: ms("30m") },
                            { label: "1 hour", value: ms("1h") },
                            { label: "2 hours", value: ms("2h") },
                            { label: "3 hours", value: ms("3h") },
                            { label: "12 hours", value: ms("12h") },
                            { label: "1 day", value: ms("1d") },
                            { label: "2 days", value: ms("2d") },
                            { label: "1 week", value: ms("1w") },
                            { label: "off", value: "off" }
                        ]}
                        onChange={event => this.handleConfigChange(event, "autoLockVaults")}
                    />
                </FormGroup>
                <FormGroup label="Show Save Dialog" helperText="Save dialog appears after submitting a form.">
                    <HTMLSelect
                        fill
                        value={config.showSaveDialog}
                        options={[
                            { label: "Always", value: "always" },
                            { label: "When Vaults Unlocked", value: "unlocked" },
                            { label: "Never", value: "never" }
                        ]}
                        onChange={event => this.handleConfigChange(event, "showSaveDialog")}
                    />
                </FormGroup>
                <FormGroup
                    label="Dynamic Entry Icons"
                    helperText="Fetch entry icons from their URLs/domains using an anonymous proxy."
                >
                    <HTMLSelect
                        fill
                        value={config.dynamicIcons}
                        options={[
                            { label: "Enabled", value: "enabled" },
                            { label: "Disabled", value: "disabled" }
                        ]}
                        onChange={event => this.handleConfigChange(event, "dynamicIcons")}
                    />
                </FormGroup>
            </SettingsContainer>
        );
    }
}
