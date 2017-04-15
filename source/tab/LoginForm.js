import { EventEmitter } from "events";

import Popup from "./popup";
import authentication from "./authentication";
import submissions from "./submissions";

const AUTOSUBMIT_DEFAULT = true;
const BUTTERCUP_LOGO = require("../common/images/logo-small.png");
const FORM_SUBMIT_AUTO_SUBMISSION = "form-auto-submit";
const FORM_SUBMIT_USER_ACTION = "form-user-action";
const INPUT_QUERY = {

    USERNAME: [
        "input[name=username]",
        "input[id=username]",
        "input[name*=username]",
        "input[id*=username]",
        "input[type=email]",
        "input[name=email]",
        "input[id=email]",
        "input[name*=user]",
        "input[id*=user]",
        "input[name*=email]",
        "input.username",
        "input.email"
    ],

    PASSWORD: [
        "input[name=password]",
        "input[id=password]",
        "input[type=password]",
        "input[name*=password]",
        "input[name*=pass]",
        "input[id*=pass]",
        "input.password"
    ],

    SUBMIT: [
        "input[name=submit][type=submit]",
        "input[name=submit]",
        "input[value*='Login']",
        "input[type=submit]"
    ]

};

export const FIRST_FORM_INC = 1;

let __nextFormID = FIRST_FORM_INC;
let __forms = {};
let __selectedForm = null;

function applyStyles(el, styles) {
    Object
        .keys(styles)
        .forEach(function setStyle(styleName) {
            el.style[styleName] = styles[styleName];
        });
}

function findFirst(queries, parent = document) {
    let element = null;
    queries.some(function(query) {
        let target = parent.querySelector(query);
        if (target) {
            element = target;
            return true;
        }
        return false;
    });
    return element;
}

export function generateFormID(nextID = __nextFormID) {
    const id = `bcup-form:${nextID}`;
    __nextFormID += 1;
    return id;
}

class LoginForm extends EventEmitter {

    constructor(form) {
        super();
        this._id = generateFormID();
        __forms[this._id] = this;
        form.setAttribute("data-buttercup-form-id", this._id);
        form.setAttribute("data-buttercup", "attached");
        this._form = form;
        this._formSubmissionType = FORM_SUBMIT_USER_ACTION;
        this._inputs = [];
        this._submitButton = null;
        this._mouseOverButton = false;
        this._popup = new Popup(this);
        this.locateKnownInputs();
        this.popup.on("entryClick", (data) => this.onEntryClick(data));
        form.addEventListener("submit", (e) => this.onFormSubmit(e), false);
    }

    get form() {
        return this._form;
    }

    get formSubmissionType() {
        return this._formSubmissionType;
    }

    get inputs() {
        return [...this._inputs];
    }

    get popup() {
        return this._popup;
    }
    
    get submitButton() {
        return this._submitButton;
    }

    set popup(p) {
        this._popup = p;
    }

    fetchValues() {
        return this.inputs.map(function mapInput(inputRecord) {
            let value = inputRecord.input.value,
                data = Object.assign({
                    value
                }, inputRecord);
            delete data.input;
            return data;
        });
    }

    filloutForm(entryData, autoSubmit = AUTOSUBMIT_DEFAULT) {
        this.inputs.forEach(function mapInput(inputRecord) {
            let { type, input } = inputRecord;
            if (type === "property") {
                let property = inputRecord.property,
                    value = entryData.properties[property];
                input.value = value;
            }
        });
        if (autoSubmit) {
            this._formSubmissionType = FORM_SUBMIT_AUTO_SUBMISSION;
            if (this.submitButton) {
                this.submitButton.click();
            } else {
                this.form.submit();
            }
        }
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
        const userInput = findFirst(INPUT_QUERY.USERNAME, this.form);
        if (userInput) {
            this._inputs.push({
                type: "property",
                input: userInput,
                property: "username"
            });
            userInput.setAttribute("autocomplete", "off");
            userInput.setAttribute("data-buttercup-input", "username");
            userInput.setAttribute("data-buttercup-form-id", this._id);
        }
        // password
        const passInput = findFirst(INPUT_QUERY.PASSWORD, this.form);
        if (passInput) {
            this._inputs.push({
                type: "property",
                input: passInput,
                property: "password"
            });
            passInput.setAttribute("autocomplete", "new-password");
            passInput.setAttribute("data-buttercup-input", "password");
            passInput.setAttribute("data-buttercup-form-id", this._id);
        }
        const submitButton = findFirst(INPUT_QUERY.SUBMIT, this.form);
        if (submitButton) {
            this._submitButton = submitButton;
        }
    }

    onEntryClick(entryData, autoSubmit = AUTOSUBMIT_DEFAULT) {
        // get data
        authentication
            .getEntryData(entryData.archiveID, entryData.id)
            .then((entryRaw) => {
                this.filloutForm(entryRaw, autoSubmit);
            })
            .catch(function(err) {
                alert(`Error loading credentials: ${err.message}`);
            });
    }

    onFormSubmit() {
        if (this.formSubmissionType === FORM_SUBMIT_USER_ACTION) {
            let values = this.fetchValues();
            submissions.trackFormData(document.title, values);
            this.emit("formSubmission");
        }
    }

    onInputClick(e) {
        if (this._mouseOverButton) {
            e.preventDefault();
            if (this.popup.open) {
                this.popup.close();
                return;
            }
            let input = e.target,
                bounds = input.getBoundingClientRect();
            this.popup.popup({
                x: bounds.left,
                y: window.scrollY + bounds.top + bounds.height + 2
            }, bounds.width);
        }
    }

    onInputExit(e) {
        let input = e.target;
        input.style.cursor = "auto";
        this._mouseOverButton = false;
    }

    onInputMove(e) {
        let input = e.target,
            bounds = input.getBoundingClientRect();
        let x = e.clientX - bounds.left;
        if (x >= (bounds.width - 18 - 5)) {
            this._mouseOverButton = true;
            input.style.cursor = "pointer";
        } else {
            this._mouseOverButton = false;
            input.style.cursor = "auto";
        }
    }

    placeContextButton(input) {
        applyStyles(input, {
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
        input.addEventListener("click", boundClick, false);
        input.addEventListener("mouseleave", boundExit, false);
        input.addEventListener("mousemove", boundMove, false);
    }

    placeContextButtons() {
        let username = this.getInputForProperty("username"),
            password = this.getInputForProperty("password");
        if (username) {
            this.placeContextButton(username.input);
        }
        if (password) {
            this.placeContextButton(password.input);
        }
    }

    select() {
        __selectedForm = this;
    }

}

LoginForm.deselect = function() {
    __selectedForm = null;
};

LoginForm.getFormWithID = function(id) {
    return __forms[id];
};

LoginForm.getSelectedForm = function() {
    return __selectedForm;
};

export default LoginForm;
