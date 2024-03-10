import React, { MouseEvent, useCallback } from "react";
import styled from "styled-components";
import { Button, Callout, Classes, Intent } from "@blueprintjs/core";
import cn from "classnames";
import { t } from "../../../shared/i18n/trans.js";
import { BUILD_DATE, VERSION } from "../../../shared/library/version.js";
import { createNewTab, getExtensionURL } from "../../../shared/library/extension.js";
import { localisedErrorMessage } from "../../../shared/library/error.js";
import { getToaster } from "../../../shared/services/notifications.js";
import BUTTERCUP_LOGO from "../../../../resources/buttercup-256.png";

interface AboutPageProps {}

const AboutSection = styled(Callout)`
    margin: 0px 12px;
    width: calc(100% - 24px);
    padding: 9px;
`;
const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;

    > .${Classes.CALLOUT}:not(:last-child) {
        margin-bottom: 8px;
    }
`;
const FooterSection = styled.div`
    width: 100%;
    padding: 8px 12px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`;
const Heading = styled.h3`
    margin-top: 3px;
    margin-bottom: 5px;
`;
const HeadingLogo = styled.img`
    width: 32px;
    height: auto;
`;
const HeadingSection = styled.div`
    width: 100%;
    padding: 8px 12px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`;
const InfoTable = styled.table`
    width: 100%;
`;

export function AboutPage(_: AboutPageProps) {
    const handleAttributionsClick = useCallback(async (event: MouseEvent) => {
        try {
            await createNewTab(getExtensionURL("full.html#/attributions"));
        } catch (err) {
            console.error(err);
            getToaster().show({
                intent: Intent.DANGER,
                message: t("error.generic", { message: localisedErrorMessage(err) }),
                timeout: 10000
            });
        }
    }, []);
    return (
        <Container>
            <HeadingSection>
                <HeadingLogo src={BUTTERCUP_LOGO} alt="Buttercup logo" />
                <Heading>Buttercup Password Manager</Heading>
            </HeadingSection>
            <AboutSection>
                <InfoTable className={cn(Classes.HTML_TABLE, Classes.COMPACT)}>
                    <thead>
                        <tr>
                            <th>{t("about.info.title")}</th>
                            <th>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{t("about.info.version")}</td>
                            <td>{VERSION}</td>
                        </tr>
                        <tr>
                            <td>{t("about.info.build-date")}</td>
                            <td>{BUILD_DATE}</td>
                        </tr>
                    </tbody>
                </InfoTable>
            </AboutSection>
            <FooterSection>
                <Button
                    onClick={handleAttributionsClick}
                >
                    {t("about.attributions")}
                </Button>
            </FooterSection>
        </Container>
    );
}
