const Popup = require("./popup.js");
const authentication = require("./authentication.js");
const submissions = require("./submissions.js");
const styles = require("./styles.js");

const BUTTERCUP_LOGO = require("../common/images/logo-small.png");

const INPUT_QUERY = {

    USERNAME: [
        `input[name=username]`,
        `input[id=username]`,
        `input[name*=username]`,
        `input[id*=username]`,
        `input[name=email]`,
        `input[id=email]`,
        `input[name*=user]`,
        `input[id*=user]`,
        `input[name*=email]`
    ],

    PASSWORD: [
        `input[name=password]`,
        `input[id=password]`,
        `input[type=password]`,
        `input[name*=password]`,
        `input[name*=pass]`,
        `input[id*=pass]`
    ]

};

function applyStyles(el, styles) {
    Object
        .keys(styles)
        .forEach(function(styleName) {
            el.style[styleName] = styles[styleName];
        });
}

styles.placeStylesheet();

class LoginForm {

    constructor(form) {
        form.setAttribute("data-buttercup", "attached");
        this._form = form;
        this._inputs = [];
        this._mouseOverButton = false;
        this._popup = new Popup(this);
        this.locateKnownInputs();
        this.popup.on("entryClick", (data) => this.onEntryClick(data));
        form.addEventListener("submit", (e) => this.onFormSubmit(e), false);
    }

    get form() {
        return this._form;
    }

    get inputs() {
        return [...this._inputs];
    }

    get popup() {
        return this._popup;
    }

    set popup(p) {
        this._popup = p;
    }

    fetchValues() {
        return this.inputs.map(function(inputRecord) {
            let value = inputRecord.input.value,
                data = Object.assign({
                    value
                }, inputRecord);
            delete data.input;
            return data;
        });
    }

    filloutForm(entryData) {
        this.inputs.forEach(function(inputRecord) {
            let { type, input } = inputRecord;
            if (type === "property") {
                let property = inputRecord.property,
                    value = entryData.properties[property];
                input.value = value;
            }
        });
    }

    getInputForProperty(property) {
        let inputs = this.inputs;
        for (let i = 0, propsLen = inputs.length; i < propsLen; i += 1) {
            if (inputs[i].type === "property" && inputs[i].property === property) {
                return inputs[i];
            }
        }
        return null;
    }

    locateKnownInputs() {
        this._inputs = [];
        // username
        let userInput = this.form.querySelector(INPUT_QUERY.USERNAME.join(","));
        if (userInput) {
            this._inputs.push({
                type: "property",
                input: userInput,
                property: "username"
            });
            userInput.setAttribute("autocomplete", "off");
        }
        // password
        let passInput = this.form.querySelector(INPUT_QUERY.PASSWORD.join(","));
        if (passInput) {
            this._inputs.push({
                type: "property",
                input: passInput,
                property: "password"
            });
            passInput.setAttribute("autocomplete", "off");
        }
    }

    onEntryClick(entryData) {
        // get data
        authentication
            .getEntryData(entryData.archiveID, entryData.id)
            .then((entryRaw) => {
                this.filloutForm(entryRaw);
            })
            .catch(function(err) {
                alert(`Error loading credentials: ${err.message}`);
            });
    }

    onFormSubmit(e) {
        let values = this.fetchValues();
        submissions.trackFormData(values);
    }

    onInputClick(e) {
        if (this._mouseOverButton) {
            e.preventDefault();
            if (this.popup.open) {
                this.popup.close();
                return;
            }
            let username = this.getInputForProperty("username");
            if (username) {
                let usernameInput = username.input,
                    bounds = usernameInput.getBoundingClientRect();
                this.popup.popup({
                    x: bounds.left,
                    y: window.scrollY + bounds.top + bounds.height + 2
                }, bounds.width);
            }
        }
    }

    onInputExit() {
        // this._mouseInsideInput = false;
        let username = this.getInputForProperty("username");
        if (username) {
            let usernameInput = username.input;
            usernameInput.style.cursor = "auto";
            this._mouseOverButton = false;
        }
    }

    onInputMove(e) {
        let username = this.getInputForProperty("username");
        if (username) {
            let usernameInput = username.input,
                bounds = usernameInput.getBoundingClientRect();
            let x = e.clientX - bounds.left;
            if (x >= (bounds.width - 18 - 5)) {
                this._mouseOverButton = true;
                usernameInput.style.cursor = "pointer";
            } else {
                this._mouseOverButton = false;
                usernameInput.style.cursor = "auto";
            }
        }
    }

    placeContextButton() {
        let username = this.getInputForProperty("username");
        if (username) {
            let usernameInput = username.input;
            applyStyles(usernameInput, {
                backgroundImage: `url("${BUTTERCUP_LOGO}")`,
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "scroll",
                backgroundSize: "18px 18px",
                backgroundPosition: "98% 50%",
                cursor: "auto"
            });
            let boundClick = this.onInputClick.bind(this),
                boundExit = this.onInputExit.bind(this),
                boundMove = this.onInputMove.bind(this);
            usernameInput.addEventListener("click", boundClick, false);
            usernameInput.addEventListener("mouseleave", boundExit, false);
            usernameInput.addEventListener("mousemove", boundMove, false);
        }
    }

}

module.exports = LoginForm;
