import React, { Component } from "react";
import NotificationSystem from "react-notification-system";

let __notificationSystem;

class Notifier extends Component {
    componentDidMount() {
        __notificationSystem = this._notificationSystem = this.refs.notificationSystem;
    }

    render() {
        return (
            <NotificationSystem ref="notificationSystem" />
        );
    }
}

export function getNotificationSystem() {
    return __notificationSystem;
}

export default Notifier;
