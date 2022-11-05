import React, { Ref } from "react";
import styled from "styled-components";
import { Colors } from "@blueprintjs/core";
import { FileIdentifier, FileItem } from "@buttercup/file-interface";
import path from "path-posix";
import { t } from "../../../shared/i18n/trans.js";

const ItemNewText = styled.div`
    font-style: italic;
    color: ${p => (p.selected ? "#fff" : Colors.GRAY1)};
    cursor: text;
`;
const NewFilenameInput = styled.input`
    border: none;
    width: 100%;
    font-size: inherit;
    background-color: transparent;
    outline: none;
`;

export function getNewTreeItem(
    parentPath: FileItem,
    editingNewFileName: string | null,
    editingNewFileDirectory: string | number | null,
    selectedFile: FileIdentifier | null,
    onNewFilenameChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onBlurNewItem: (event: React.FocusEvent<HTMLInputElement>) => void,
    onKeypressNewItem: (event: React.KeyboardEvent<HTMLInputElement>) => void,
    newItemRef: Ref<HTMLInputElement>
) {
    const currentlyEditingThis = editingNewFileDirectory === parentPath.identifier &&
        editingNewFileName.length > 0;
    const isSelected =
        currentlyEditingThis &&
        path.join(editingNewFileDirectory, editingNewFileName) === selectedFile.identifier;
    const label = editingNewFileDirectory === parentPath.identifier && typeof editingNewFileName === "string" ?
        (
            <NewFilenameInput
                type="text"
                value={editingNewFileName}
                onChange={onNewFilenameChange}
                onBlur={onBlurNewItem}
                onKeyPress={onKeypressNewItem}
                autoFocus
                ref={newItemRef}
            />
        ) : (
            <ItemNewText
                selected={isSelected}
            >
                {currentlyEditingThis ? editingNewFileName : t("add-vault-page.section-select.new-file-placeholder")}
            </ItemNewText>
        );
    return {
        id: "new-vault-file",
        icon: "plus",
        label,
        isSelected,
        nodeData: {
            new: true,
            parent: parentPath
        }
    };
}
