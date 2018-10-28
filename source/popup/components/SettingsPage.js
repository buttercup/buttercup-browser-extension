import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { InputGroup, FormGroup, Switch, HTMLSelect } from "@blueprintjs/core";

export default class EntriesPage extends PureComponent {
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
            <Fragment>
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
            </Fragment>
        );
    }
}
