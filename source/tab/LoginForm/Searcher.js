define("LoginForm/Searcher", ["LoginForm/SearchPatterns"], function(SearchPatterns) {

    "use strict";

    const   __formPatterns = SearchPatterns.forms,
            __inputPatterns = SearchPatterns.inputs;

    function getForms() {
        return Array.prototype.slice.call(document.getElementsByTagName("form"));
    }

    function getInputs(form) {
        return Array.prototype.slice.call(form.getElementsByTagName("input"));
    }

    return {

        getLoginData: function(form) {
            let data = {};
            getInputs(form)
                .forEach(function(input) {
                    __inputPatterns.some(function(inputPattern) {
                        return inputPattern.properties.some(function(prop) {
                            //console.log("Test", input, prop, inputPattern.expression.test(input.getAttribute(prop) || ""));
                            if (inputPattern.expression.test(input.getAttribute(prop) || "")) {
                                let type = inputPattern.buttercup,
                                    value = input.getAttribute("value") || "";
                                if (!data[type]) {
                                    data[type] = value;
                                }
                                return true;
                            }
                            return false;
                        });
                    });
                });
            return data;
        },

        getLoginForms: function() {
            return getForms()
                .filter(function(form) {
                    return __formPatterns.some(function(formPattern) {
                        return formPattern.properties.some(function(prop) {
                            return formPattern.expression.test(form.getAttribute(prop) || "");
                        });
                    });
                });
        }

    };

});
