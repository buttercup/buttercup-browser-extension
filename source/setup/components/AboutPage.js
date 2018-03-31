import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import browserInfo from "browser-info";
import LayoutMain from "./LayoutMain.js";
import { version } from "../../../package.json";

const Content = styled.div`
    width: calc(100% - 24px);
    padding: 0px 12px;
`;

class AboutPage extends Component {
    render() {
        const browserData = browserInfo();
        return (
            <LayoutMain title="About">
                <Content>
                    <h2>Buttercup</h2>
                    <p>
                        Buttercup is a password management and security platform, built to be an easy-to-use, free and
                        highly-secure tool for all users. Security is important for everyone and{" "}
                        <strong>free security must be the baseline</strong> so that everyone can be sure that their
                        identities and secrets are safe.
                    </p>
                    <p>
                        The Buttercup suite boasts apps for every major platform so that users can access their content
                        anywhere. This extension is a part of that ecosystem and you can use it to assist you in your
                        daily activities.
                    </p>
                    <h2>This browser extension</h2>
                    <p>
                        The Buttercup browser extension provides access to your encrypted archives so that you can use
                        their details when logging in to your accounts. Buttercup will do its best to recognise which
                        site you're browsing and can suggest possible logins for it.
                    </p>
                    <p>
                        When presented with a login form, <strong>Buttercup will attach login buttons</strong> to help
                        you log in to the service without having to remember any complex passwords. Keep your master
                        password safe and let Buttercup protect your accounts with highly secure complex pass phrases.
                    </p>
                    <h2>Version and info</h2>
                    <dd>
                        <dt>Version</dt>
                        <dd>{version}</dd>
                        <dt>Browser</dt>
                        <dd>
                            <With infoKeys={Object.keys(browserData)}>
                                <For each="infoKey" of={infoKeys}>
                                    <strong>{infoKey}</strong>: {browserData[infoKey]}
                                    <br />
                                </For>
                            </With>
                        </dd>
                    </dd>
                </Content>
            </LayoutMain>
        );
    }
}

export default AboutPage;
