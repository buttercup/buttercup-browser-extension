import { ulid } from "ulidx";
import EventEmitter from "eventemitter3";
import { getCurrentTitle, getCurrentURL } from "../library/page.js";
import { LoginTarget } from "@buttercup/locust";

interface Connection {
    id: string;
    loginTarget: LoginTarget;
    entry: boolean;
    username: string;
    password: string;
    _username: string;
    _password: string;
}

interface LoginTrackerEvents {
    credentialsChanged: (event: { id: string; username: string; password: string; entry: boolean }) => void;
}

let __sharedTracker = null;

export class LoginTracker extends EventEmitter<LoginTrackerEvents> {
    protected _connections: Array<Connection> = [];
    protected _title = getCurrentTitle();
    protected _url = getCurrentURL();

    get title() {
        return this._title;
    }

    get url() {
        return this._url;
    }

    getConnection(loginTarget: LoginTarget) {
        return this._connections.find(
            (conn) => conn.loginTarget === loginTarget || conn.loginTarget.form === loginTarget.form
        );
    }

    registerConnection(loginTarget: LoginTarget) {
        const _this = this;
        const connection: Connection = {
            id: ulid(),
            loginTarget,
            entry: false,
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
                    id: connection.id,
                    username: connection.username,
                    password: connection.password,
                    entry: connection.entry
                });
            },
            set password(pw) {
                connection._password = pw;
                _this.emit("credentialsChanged", {
                    id: connection.id,
                    username: connection.username,
                    password: connection.password,
                    entry: connection.entry
                });
            }
        };
        this._connections.push(connection);
    }
}

export function getSharedTracker(): LoginTracker {
    if (!__sharedTracker) {
        __sharedTracker = new LoginTracker();
    }
    return __sharedTracker;
}
