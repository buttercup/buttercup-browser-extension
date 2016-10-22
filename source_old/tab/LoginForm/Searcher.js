define("LoginForm/Searcher", [
    "LoginForm/SearchPatterns",
    "LoginForm/Form"
], function(SearchPatterns, LoginForm) {

    "use strict";

    const   __formPatterns = SearchPatterns.forms;//,
            //__inputPatterns = SearchPatterns.inputs;

    function getForms() {
        return Array.prototype.slice.call(document.getElementsByTagName("form"));
    }

    function getInputs(form) {
        return Array.prototype.slice.call(form.getElementsByTagName("input"));
    }

    const lib = {

        getLoginData: function(form) {
            // let inputs = Array.prototype.slice.call(form.elements),
            //     data = {
            //         title: lib.getLoginTitle()
            //     },
            //     inputInfo = [],
            //     types = [];
            // inputs.forEach(function(input) {
            //     let info = {
            //         matchedTypes: {},
            //         input: input
            //     };
            //     __inputPatterns.forEach(function(inputPattern) {
            //         inputPattern.properties.forEach(function(prop) {
            //             if (inputPattern.expression.test(input.getAttribute(prop) || "")) {
            //                 info.matchedTypes[inputPattern.buttercup] = info.matchedTypes[inputPattern.buttercup] ?
            //                     info.matchedTypes[inputPattern.buttercup] + 1 : 1;
            //                 if (types.indexOf(inputPattern.buttercup) < 0) {
            //                     types.push(inputPattern.buttercup);
            //                 }
            //             }
            //         });
            //     });
            //     inputInfo.push(info);
            // });
            // types.forEach(function(buttercupType) {
            //     let inputCandidates = inputInfo
            //         .filter(info => Object.keys(info.matchedTypes).indexOf(buttercupType) >= 0);
            //     inputCandidates.sort(function(a, b) {
            //         let aVal = a.matchedTypes[buttercupType],
            //             bVal = b.matchedTypes[buttercupType];
            //         if (aVal < bVal) {
            //             return -1;
            //         } else if (aVal > bVal) {
            //             return 1;
            //         }
            //         return 0;
            //     });
            //     if (inputCandidates.length > 0) {
            //         data[buttercupType] = inputCandidates[0].input.value;
            //     }
            // });
            // return data;
            return {
                title:      form.getInputData("title"),
                username:   form.getInputData("username"),
                password:   form.getInputData("password")
            };
        },

        getLoginForms: function() {
            return getForms()
                .filter(function(form) {
                    return __formPatterns.some(function(formPattern) {
                        return formPattern.properties.some(function(prop) {
                            return formPattern.expression.test(form.getAttribute(prop) || "");
                        });
                    });
                })
                .map((form) => new LoginForm(form));
        },

        getLoginTitle: function() {
            return document.title || document.location.host || "";
        }

    };

    return lib;

});
