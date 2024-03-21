import React, { Fragment, useCallback, useState } from "react";
import cn from "classnames";
import styled from "styled-components";
import { Button, Classes, Intent, NonIdealState, Spinner } from "@blueprintjs/core";
import { useTitle } from "../../hooks/document.js";
import { t } from "../../../shared/i18n/trans.js";
import { Layout } from "../Layout.js";
import { useDisabledDomains } from "../../hooks/disabledDomains.js";
import { ErrorMessage } from "../../../shared/components/ErrorMessage.js";
import { ConfirmDialog } from "../../../shared/components/ConfirmDialog.js";
import { getToaster } from "../../../shared/services/notifications.js";
import { localisedErrorMessage } from "../../../shared/library/error.js";
import { removeDisabledDomain } from "../../services/disabledDomains.js";

const ActionCell = styled.td`
    vertical-align: middle !important;
`;
const CenteredContent = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;
const LoaderContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 20px 0px;
`;
const Table = styled.table`
    min-width: 80%;
    table-layout: fixed;
`;

export function DisabledDomainsPage() {
    useTitle(t("disabled-domains-page.title"));
    const [reloadCount, setReloadCount] = useState<number>(0);
    const [domains, loading, error] = useDisabledDomains([reloadCount]);
    const [removeDomain, setRemoveDomain] = useState<string | null>(null);
    const handleDomainRemove = useCallback(async () => {
        if (!removeDomain) return;
        try {
            removeDisabledDomain(removeDomain);
            setReloadCount(count => count += 1);
        } catch (err) {
            console.error(err);
            getToaster().show({
                intent: Intent.DANGER,
                message: t("error.generic", { message: localisedErrorMessage(err) }),
                timeout: 10000
            });
        }
        setRemoveDomain(null);
    }, [removeDomain]);
    return (
        <Layout title={t("disabled-domains-page.title")}>
            <p dangerouslySetInnerHTML={{ __html: t("disabled-domains-page.description") }} />
            <h3>{t("disabled-domains-page.disabled-domains.heading")}</h3>
            {error && (
                <ErrorMessage message={error.message} scroll={false} />
            )}
            {loading && (
                <LoaderContainer>
                    <Spinner size={60} />
                </LoaderContainer>
            )}
            {!error && !loading && Array.isArray(domains) && (
                <Fragment>
                    {domains.length > 0 && (
                        <CenteredContent>
                            <Table className={cn(Classes.HTML_TABLE, Classes.HTML_TABLE_STRIPED)}>
                                <thead>
                                    <tr>
                                        <th>{t("disabled-domains-page.table.domain-heading")}</th>
                                        <th>{t("disabled-domains-page.table.action-heading")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {domains.map((domain, ind) => (
                                        <tr key={`${domain}-${ind}`}>
                                            <td>
                                                <pre>{domain}</pre>
                                            </td>
                                            <ActionCell>
                                                <Button
                                                    icon="delete"
                                                    intent={Intent.DANGER}
                                                    minimal
                                                    onClick={() => setRemoveDomain(domain)}
                                                    title={t("disabled-domains-page.table.action.delete")}
                                                />
                                            </ActionCell>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </CenteredContent>
                    ) || (
                        <NonIdealState
                            description={t("disabled-domains-page.table.empty-description")}
                            icon="exclude-row"
                            title={t("disabled-domains-page.table.empty-title")}
                        />
                    )}
                </Fragment>
            )}
            <ConfirmDialog
                confirmIntent={Intent.DANGER}
                confirmText={t("disabled-domains-page.delete-dialog.confirm")}
                icon="delete"
                isOpen={!!removeDomain}
                onClose={() => setRemoveDomain(null)}
                onConfirm={handleDomainRemove}
                title={t("disabled-domains-page.delete-dialog.title")}
            >
                <span dangerouslySetInnerHTML={{
                    __html: t("disabled-domains-page.delete-dialog.description").replace("{{domain}}", removeDomain ?? "")
                }} />
            </ConfirmDialog>
        </Layout>
    );
}
