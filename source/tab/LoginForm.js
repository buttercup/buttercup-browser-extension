const Popup = require("./popup.js");
const authentication = require("./authentication.js");
const submissions = require("./submissions.js");

const BUTTERCUP_LOGO = "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAuAAD/4QMtaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTY2QjE5RjlCQ0RFMTFFNkJCNUFDRUExQ0JERjc1NDMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTY2QjE5RkFCQ0RFMTFFNkJCNUFDRUExQ0JERjc1NDMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1NjZCMTlGN0JDREUxMUU2QkI1QUNFQTFDQkRGNzU0MyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1NjZCMTlGOEJDREUxMUU2QkI1QUNFQTFDQkRGNzU0MyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv/uAA5BZG9iZQBkwAAAAAH/2wCEAAoHBwcHBwoHBwoOCQgJDhAMCgoMEBMPDxAPDxMSDhAPDxAOEhIVFhcWFRIdHR8fHR0pKSkpKS8vLy8vLy8vLy8BCgkJCgsKDQsLDRANDg0QFA4ODg4UFw8PEQ8PFx0VEhISEhUdGhwXFxccGiAgHR0gICgoJigoLy8vLy8vLy8vL//AABEIACAAIAMBIgACEQEDEQH/xAB+AAACAwEAAAAAAAAAAAAAAAADBgIFBwQBAAIDAQAAAAAAAAAAAAAAAAABAgMEBRAAAgECAwYDCAMAAAAAAAAAAQIDEQQAEgUhMVFxIgaBkaHwQWEyQhNDB4KSohEAAgEDAwQDAAAAAAAAAAAAAQIEABESITED8EFRcSIyFP/aAAwDAQACEQMRAD8A2GeeK2iaaZgkaAlmOwADaSThQvv2AFcpp1uHQflmJAPJBQ054H35qUmaPTkNEY55KHeFy5R/YmvIYqtF069udPe502GKW7+8Y2ebIwjRVDdCyVWrE7TTGjj41CZvrfbsK4c6dJaSYsUlcBd2Vc3Ol7KKuLL9gEyBdQtgqH8kJJpzVq+hw321zDdwrPA4eNwGVlNQQdxGMy17S7my+xdy26wCZAJxEQYhMC3y0+XMoDUxb9ianIksmnOaxkiSMcM3SwH8sp8+ODk40KZpp5FRgT5SyvyS/ll9GIxba4v7qPf1jIk8d8BVD0seAIFP9A15jHBoGs6dY6dNZ3rupllz0RSemi/Uu7aMaJfWMGoW7W86hlYEbRXfx+GEPU+xbyCQtZMXjJ2LQvTxXq818ThI6lMHJFtjVsuHJ45RmRVXkLLi6N6se4veh9w9yWmoWRsrTM5kdXd2XKFC7aKD7ycH7DsZJbuS9IpGtFB45epvXL64FpvYt7PIGvCUjB2ihSvi3V5Lh90+wt9Ot1t7dQqqANgpu4fD231OB3RUwTW+5pRYsrmliZLAQoLIg6Pmv//Z";

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
        console.log("Click", entryData);
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
        // e.preventDefault();
        // alert("SUBMIT");
        let values = this.fetchValues();
        console.log(values);
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
                    y: bounds.top + bounds.height + 2
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
