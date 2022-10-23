import React, { Ref } from "react";
import styled from "styled-components";
import { Colors } from "@blueprintjs/core";
import { FileIdentifier, PathIdentifier } from "@buttercup/file-interface";
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
    parentPath: PathIdentifier | FileIdentifier,
    editingNewFileName: string | null,
    editingNewFileDirectory: string | null,
    selectedFileName: FileIdentifier | null,
    onEditNewItem: (event: React.MouseEvent<HTMLInputElement>, parentPath: PathIdentifier | FileIdentifier) => void,
    onNewFilenameChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onBlurNewItem: (event: React.FocusEvent<HTMLInputElement>) => void,
    onKeypressNewItem: (event: React.KeyboardEvent<HTMLInputElement>) => void,
    newItemRef: Ref<HTMLInputElement>
) {
    const currentlyEditingThis = editingNewFileDirectory === parentPath.identifier &&
        editingNewFileName.length > 0;
    const isSelected =
        currentlyEditingThis &&
        path.join(editingNewFileDirectory, editingNewFileName) === selectedFileName;
    const label = editingNewFileDirectory === parentPath.identifier && editingNewFileName ?
        (
            <NewFilenameInput
                type="text"
                value={editingNewFileName}
                onChange={onNewFilenameChange}
                onBlur={onBlurNewItem}
                onKeyPress={onKeypressNewItem}
                innerRef={newItemRef}
            />
        ) : (
            <ItemNewText selected={isSelected} onClick={(evt) => onEditNewItem(evt, parentPath)} role="button">
                {currentlyEditingThis ? editingNewFileName : t("add-vault-page.section-select.new-file-placeholder")}
            </ItemNewText>
        );
    return {
        id: "new-vault-file",
        icon: "plus",
        label,
        isSelected
    };
}
