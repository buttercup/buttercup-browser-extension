import uuid from "uuid/v4";
import EventEmitter from "eventemitter3";
import { getCurrentTitle, getCurrentURL } from "./page.js";

let __sharedTracker = null;

export default class LoginTracker extends EventEmitter {
    _url = getCurrentURL();
    _title = getCurrentTitle();
    _connections = [];

    get title() {
        return this._title;
    }

    get url() {
        return this._url;
    }

    getConnection(loginTarget) {
        return this._connections.find(conn => conn.loginTarget === loginTarget);
    }

    registerConnection(loginTarget) {
        const _this = this;
        const connection = {
            id: uuid(),
            loginTarget,
            _username: "",
            _password: "",
            get username() {
                return connection._username;
            },
            get password() {
                return connection._password;
            },
            set username(un) {
                connection._username = un;
                _this.emit("credentialsChanged", {
                    username: connection.username,
                    password: connection.password
                });
            },
            set password(pw) {
                connection._password = pw;
                _this.emit("credentialsChanged", {
                    username: connection.username,
                    password: connection.password
                });
            }
        };
        this._connections.push(connection);
    }
}

export function getSharedTracker() {
    if (!__sharedTracker) {
        __sharedTracker = new LoginTracker();
    }
    return __sharedTracker;
}
