import React from "react";
import styled from "styled-components";
import { Divider } from "@blueprintjs/core";
import { VaultItem } from "./VaultItem.js";
import { VaultSourceDescription } from "../../types.js";

interface VaultItemListProps {
    vaults: Array<VaultSourceDescription>;
}

const ScrollList = styled.div`
    max-height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
`;

export function VaultItemList(props: VaultItemListProps) {
    return (
        <ScrollList>
            {props.vaults.map((vault, ind) => (
                <>
                    <VaultItem
                        isDetailsVisible={false}
                        vault={vault}
                        key={vault.id}
                    />
                    <Divider />
                </>
            ))}
        </ScrollList>
    );
}
