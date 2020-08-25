import React, { Fragment } from "react";
import { Toaster, Position, Text, Classes } from "@blueprintjs/core";

export default Toaster.create({
    className: "buttercup-notifier",
    position: Position.RIGHT_TOP,
});

export const Message = ({ title, message }) => (
    <Fragment>
        <Text>{title}</Text>
        <Text className={Classes.TEXT_SMALL}>{message}</Text>
    </Fragment>
);
