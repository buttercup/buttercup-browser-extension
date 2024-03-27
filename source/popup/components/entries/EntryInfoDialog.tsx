import React, { useMemo } from "react";
import { Button, Classes, Dialog, DialogBody } from "@blueprintjs/core";
import { SearchResult } from "buttercup";
import cn from "classnames";
import styled from "styled-components";

interface EntryInfoDialogProps {
    entry: SearchResult | null;
    onClose: () => void;
}

interface EntryProperty {
    key: string;
    sensitive: boolean;
    title: string;
    value: string;
}

const InfoDialog = styled(Dialog)`
    max-width: 90%;
`;
const InfoDialogBody = styled(DialogBody)`
    display: flex;
    flex-direction: row;
    justify-content: stretch;
    align-items: flex-start;
    overflow-x: hidden;
`;
const InfoTable = styled.table`
    table-layout: fixed;
    width: 100%;
`;
const ValueInput = styled.input`
    width: 100%;
`;

export function EntryInfoDialog(props: EntryInfoDialogProps) {
    const { entry, onClose } = props;
    const properties = useMemo(() => entry ? orderProperties(entry.properties) : [], [entry]);
    return (
        <InfoDialog
            icon="info-sign"
            isCloseButtonShown
            isOpen={!!entry}
            onClose={onClose}
            title={entry?.properties.title ?? "Untitled Entry"}
        >
            <InfoDialogBody>
                <InfoTable className={cn(Classes.HTML_TABLE, Classes.COMPACT, Classes.HTML_TABLE_STRIPED)}>
                    <tbody>
                        {properties.map(property => (
                            <tr key={property.key}>
                                <td style={{ width: "100%" }}>
                                    {property.title}<br />
                                    <ValueInput className={Classes.INPUT} type={property.sensitive ? "password" : "text"} value={property.value} readOnly />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </InfoTable>
            </InfoDialogBody>
        </InfoDialog>
    );
}

function orderProperties(properties: Record<string, string>): Array<EntryProperty> {
    const working = { ...properties };
    delete working["title"];
    const output: Array<EntryProperty> = [];
    if (working["username"]) {
        output.push({
            key: "username",
            sensitive: false,
            title: "Username",
            value: properties["username"]
        });
        delete working["username"];
    }
    if (working["password"]) {
        output.push({
            key: "password",
            sensitive: true,
            title: "Password",
            value: properties["password"]
        });
        delete working["password"];
    }
    for (const prop in working) {
        output.push({
            key: prop,
            sensitive: false,
            title: prop,
            value: working[prop]
        });
    }
    return output;
}
