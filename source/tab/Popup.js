function createPopup(position, width) {
    let container = document.createElement("div");
    container.style.border = "1px solid #000";
    container.style.left = `${position.x}px`;
    container.style.top = `${position.y}px`;
    container.style.position = "absolute";
    container.style.width = `${width}px`;
    container.style.height = "100px";
    container.style.backgroundColor = "#FFF";
    let header = document.createElement("div");
    header.style.width = "100%";
    header.style.height = "20px";
    header.style.position = "absolute";
    header.style.left = "0px";
    header.style.top = "0x";
    header.style.borderBottom = "1px solid #999";
    container.appendChild(header);
    let passwordsContainer = document.createElement("div");
    passwordsContainer.style.width = "100%";
    passwordsContainer.style.height = "80px";
    passwordsContainer.style.position = "absolute";
    passwordsContainer.style.left = "0px";
    passwordsContainer.style.top = "21px";
    passwordsContainer.style.backgroundColor = "#EEE";
    container.appendChild(passwordsContainer);
    // content

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

    getItemsForPage() {
        
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
