let __placedStylesheet = false;

const OPEN_SANS = require("../../resources/OpenSans-regular.ttf");

module.exports = {

    placeStylesheet: function() {
        if (__placedStylesheet) {
            return;
        }
        __placedStylesheet = true;
        let style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = `
            @font-face {
                font-family: "Buttercup-OpenSans";
                src: url(${OPEN_SANS});
                font-weight: normal;
                font-style: normal;
            }
        `;
        document.head.appendChild(style);
    }

};
