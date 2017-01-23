import {
    el,
    mount,
    unmount
} from "redom";
import { EventEmitter } from "events";

import config from "../common/config";

const NOPE = function() {};
const BUTTON_STYLES = {
    width: "50px",
    // height: "30px",
    backgroundColor: config.BUTTERCUP_GREEN,
	"-moz-border-radius": "7px",
	"-webkit-border-radius": "7px",
	borderRadius: "7px",
	border: "1px solid #18ab29",
	display: "block",
	cursor: "pointer",
	color: "#ffffff",
	fontSize: "15px",
	padding: "6px 10px",
	textDecoration: "none",
	textShadow: "0px 1px 0px #2f6627",
    "-webkit-font-smoothing": "auto",
    fontSmooth: "auto"
};

function createPrompt(prompt) {
    let title = el(
        "span",
        {
            style: {
                fontSize: "16px",
                fontFamily: `Buttercup-OpenSans`,
                color: "#FFF",
                lineHeight: "normal",
                fontWeight: "normal",
                "-webkit-font-smoothing": "auto",
                fontSmooth: "auto"
            }
        },
        "Save new credentials?"
    );
    prompt._yesButton = el(
        "button",
        {
            style: Object.assign({
                position: "absolute",
                bottom: "15px",
                right: "70px"
            }, BUTTON_STYLES)
        },
        "Yes"
    );
    prompt._noButton = el(
        "button",
        {
            style: Object.assign({
                position: "absolute",
                bottom: "15px",
                right: "15px"
            }, BUTTON_STYLES)
        },
        "No"
    );
    prompt._rootElement = el(
        "div",
        {
            style: {
                position: "fixed",
                boxSizing: "border-box",
                top: "10px",
                right: "20px",
                padding: "15px",
                width: "160px",
                height: "130px",
                overflow: "hidden",
                background: config.BACKGROUND_DARK_TRANSPARENT,
                borderRadius: "3px",
                zIndex: 99999999,
                "-webkit-box-shadow": "0px 0px 10px 6px rgba(255,255,255,0.75)",
                "-moz-box-shadow": "0px 0px 10px 6px rgba(255,255,255,0.75)",
                "box-shadow": "0px 0px 10px 6px rgba(255,255,255,0.75)"
            }
        },
        title,
        prompt._yesButton,
        prompt._noButton
    );
}

class SavePrompt extends EventEmitter {

    constructor() {
        super();
        createPrompt(this);
    }

    get rootElement() {
        return this._rootElement;
    }

    close() {
        unmount(document.body, this.rootElement);
    }

    onNoClick(e) {
        e.preventDefault();
        this.close();
    }

    onYesClick(e) {
        e.preventDefault();
        this.close();
        chrome.runtime.sendMessage({ command: "open-add-last-login" }, NOPE);
        // chrome.tabs.create({'url': chrome.extension.getURL('setup.html#/addLastLogin')}, function() {});
    }

    show() {
        mount(document.body, this.rootElement);
        this._boundOnNoClick = this.onNoClick.bind(this);
        this._boundOnYesClick = this.onYesClick.bind(this);
        this._yesButton.addEventListener("click", this._boundOnYesClick, false);
        this._noButton.addEventListener("click", this._boundOnNoClick, false);
    }

}

export default SavePrompt;
