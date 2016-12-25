const LoginForm = require("./LoginForm.js");

const FORM_QUERIES = [
    `form[id*=login]`,
    `form[name*=login]`,
    `form label[for*=login]`,
    `form input[name*=username]`,
    `form input[type=password]`
];

function findFormElement(el) {
    if (el.tagName.toLowerCase() === "form") {
        return el;
    }
    let current = el;
    do {
        current = current.parentNode;
        if (current && current.tagName.toLowerCase() === "form") {
            return current;
        }
    } while (current && current !== document.body);
    return null;
}

class FormFinder {

    constructor() {
        this._forms = [];
    }

    findLoginForms() {
        let query = FORM_QUERIES.join(","),
            elements = Array.prototype.slice.call(document.querySelectorAll(query)),
            forms = elements
                .map(findFormElement)
                .filter(el => el !== null)
                // filter duplicates
                .filter((el, index, arr) => arr.indexOf(el) === index)
                .filter(el => el.getAttribute("data-buttercup") !== "attached")
                .map(form => new LoginForm(form));
                // @todo filter forms with no password etc.
        return this._forms = forms;
    }

}

module.exports = FormFinder;
