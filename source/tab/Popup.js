function createPopup(position, width) {
    let container = document.createElement("div");
    container.style.border = "1px solid #000";
    container.style.left = `${position.x}px`;
    container.style.top = `${position.y}px`;
    container.style.position = "absolute";
    container.style.width = `${width}px`;
    container.style.height = "100px";
    container.style.backgroundColor = "#FFF";
    container.innerHTML = `<strong>Buttercup</strong>`;
    return container;
}

class Popup {

    constructor(loginForm) {
        this._form = loginForm;
        this._root = null;
        this._removeListeners = null;
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

    popup(position, width) {
        if (this._root) {
            this.close();
        }
        setTimeout(() => {
            this._root = createPopup(position, width);
            document.body.appendChild(this._root);
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
