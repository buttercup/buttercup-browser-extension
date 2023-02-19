import React, { useMemo } from "react";
import { VaultSourceStatus } from "buttercup";
import { Colors, Icon, IconName } from "@blueprintjs/core";
import styled from "styled-components";

interface VaultStateIndicatorProps {
    state: VaultSourceStatus;
}

// const StateIcon = styled(Icon)`
//     fill: ${Colors.GREEN3};
// `;

export function VaultStateIndicator(props: VaultStateIndicatorProps) {
    const [colour, icon] = useMemo<[string, IconName]>(() => {
        switch (props.state) {
            case VaultSourceStatus.Unlocked:
                return [Colors.GREEN4, "unlock"];
            case VaultSourceStatus.Locked:
                return [Colors.RED4, "lock"];
            default:
                return [Colors.ORANGE4, "exchange"];
        }
    }, [props.state]);
    return (
        <Icon color={colour} icon={icon} size={10} />
    );
}
