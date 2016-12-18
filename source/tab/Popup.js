const {
    el,
    mount
} = require("redom");

function createPopup(position, width) {
    const HEIGHT = 130;
    let container = el(
        "div",
        {
            "data-buttercup-role": "container",
            style: {
                border: "1px solid #000",
                left: `${position.x}px`,
                top: `${position.y}px`,
                position: "absolute",
                width: `${width}px`,
                height: `${HEIGHT}px`,
                backgroundColor: "#FFF",
                overflow: "hidden"
            }
        },
        el(
            "div",
            {
                "data-buttercup-role": "header",
                style: {
                    width: "100%",
                    height: "20px",
                    position: "absolute",
                    left: "0px",
                    top: "0px",
                    borderBottom: "1px solid #999"
                }
            }
        ),
        el(
            "div",
            {
                "data-buttercup-role": "listbox",
                style: {
                    width: "100%",
                    height: `${HEIGHT - 20}px`,
                    position: "absolute",
                    left: "0px",
                    top: "21px",
                    backgroundColor: "#EEE",
                    overflowX: "hidden",
                    overflowY: "scroll"
                }
            }
        )
    );
    return container;
}

class Popup {

    constructor(loginForm) {
        this._form = loginForm;
        this._root = null;
        this._removeListeners = null;
    }

    get open() {
        return !!this._root;
    }

    close() {
        if (this._root) {
            document.body.removeChild(this._root)
        }
        if (this._removeListeners) {
            this._removeListeners();
        }
        this._root = null;
        this._removeListeners = null;
    }

    getItemsForPage() {
        
    }

    popup(position, width) {
        if (this._root) {
            this.close();
        }
        setTimeout(() => {
            this._root = createPopup(position, width);
            mount(document.body, this._root);
            let onClick = (e) => {
                if (this._root && this._root.contains(e.target)) {
                    e.stopPropagation();
                    return;
                }
                this.close();
            };
            document.body.addEventListener("click", onClick, false);
            this._removeListeners = () => document.body.removeEventListener("click", onClick, false);
        }, 50);
    }

}

module.exports = Popup;
