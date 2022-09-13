import { ulid } from "ulidx";
import EventEmitter from "eventemitter3";
import { getCurrentTitle, getCurrentURL } from "../library/page.js";

let __sharedTracker = null;

export class LoginTracker extends EventEmitter {
    protected _connections = [];
    protected _title = getCurrentTitle();
    protected _url = getCurrentURL();

    get title() {
        return this._title;
    }

    get url() {
        return this._url;
    }

    getConnection(loginTarget) {
        return this._connections.find(
            (conn) => conn.loginTarget === loginTarget || conn.loginTarget.form === loginTarget.form
        );
    }

    registerConnection(loginTarget) {
        const _this = this;
        const connection = {
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
                _this.emit("credentialsChanged", connection);
            },
            set password(pw) {
                connection._password = pw;
                _this.emit("credentialsChanged", connection);
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
