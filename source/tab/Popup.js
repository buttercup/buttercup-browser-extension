const {
    el,
    mount
} = require("redom");
const EventEmitter = require("events").EventEmitter;

const matching = require("./matching.js");

function createPopup(position, width) {
    const HEIGHT = 130;
    let list = el(
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
        ),
        container = el(
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
            list
        );
    return {
        root: container,
        list
    };
}

class Popup extends EventEmitter {

    constructor(loginForm) {
        super();
        this._form = loginForm;
        this._elements = null;
        this._removeListeners = null;
    }

    get elements() {
        return this._elements;
    }

    get open() {
        return !!this._elements;
    }

    close() {
        if (this._elements) {
            document.body.removeChild(this._elements.root)
        }
        if (this._removeListeners) {
            this._removeListeners();
        }
        this._elements = null;
        this._removeListeners = null;
    }

    getItemsForPage() {
        return matching.getItemsForCurrentURL();
    }

    popup(position, width) {
        if (this._elements) {
            this.close();
        }
        setTimeout(() => {
            this._elements = createPopup(position, width);
            mount(document.body, this._elements.root);
            this.getItemsForPage().then(items => this.updatePageItems(items));
            let onClick = (e) => {
                if (this._elements && this._elements.root.contains(e.target)) {
                    e.stopPropagation();
                    return;
                }
                this.close();
            };
            document.body.addEventListener("click", onClick, false);
            this._removeListeners = () => document.body.removeEventListener("click", onClick, false);
        }, 50);
    }

    updatePageItems(items) {
        console.log("Items", items);
        this.elements.list.innerHTML = "";
        let listEl = el("ul");
        mount(this.elements.list, listEl);
        items.forEach((item) => {
            let listItem = el("li", {
                style: {
                    cursor: "pointer"
                }
            }, item.title);
            mount(listEl, listItem);
            listItem.addEventListener("click", (event) => {
                this.close();
                this.emit("entryClick", item);
            }, false);
        });
    }

}

module.exports = Popup;
