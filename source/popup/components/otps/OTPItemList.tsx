import React, { Fragment } from "react";
import styled from "styled-components";
import { Divider } from "@blueprintjs/core";
import { OTPItem } from "./OTPItem.js";
import { PreparedOTP } from "../../hooks/otp.js";
import { OTP } from "../../types.js";

interface OTPItemListProps {
    onOTPClick: (otp: OTP) => void;
    otps: Array<PreparedOTP>;
}

const ButtonRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-start;

    > button:not(:last-child) {
        margin-right: 6px;
    }
`;
const ScrollList = styled.div`
    max-height: 100%;
    // overflow-x: hidden;
    // overflow-y: scroll;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
`;

export function OTPItemList(props: OTPItemListProps) {
    const {
        onOTPClick,
        otps
    } = props;
    
    return (
        <>
            <ScrollList>
                {otps.map((otp) => (
                    <Fragment key={`${otp.entryID}:${otp.otpURL}`}>
                        <OTPItem
                            otp={otp}
                            onClick={() => onOTPClick(otp)}
                        />
                        <Divider />
                    </Fragment>
                ))}
            </ScrollList>
        </>
    );
}
