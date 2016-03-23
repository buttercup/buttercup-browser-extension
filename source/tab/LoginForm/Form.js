define("LoginForm/Form", ["LoginForm/SearchPatterns"], function(SearchPatterns) {

    "use strict";

    const __inputPatterns = SearchPatterns.inputs;

    class Form {

        constructor(formElement) {
            this.form = formElement;
            this.locateComponents();
        }

        getInputData(inputRole) {
            return (this.inputs && this.inputs[inputRole]) ?
                this.inputs[inputRole].value || "" : "";
        }

        locateComponents() {
            this.inputs = {};
            let inputs = Array.prototype.slice.call(this.form.elements),
                inputInfo = [],
                types = [];
            inputs.forEach(function(input) {
                let info = {
                    matchedTypes: {},
                    input: input
                };
                __inputPatterns.forEach(function(inputPattern) {
                    inputPattern.properties.forEach(function(prop) {
                        if (inputPattern.expression.test(input.getAttribute(prop) || "")) {
                            info.matchedTypes[inputPattern.buttercup] = info.matchedTypes[inputPattern.buttercup] ?
                                info.matchedTypes[inputPattern.buttercup] + 1 : 1;
                            if (types.indexOf(inputPattern.buttercup) < 0) {
                                types.push(inputPattern.buttercup);
                            }
                        }
                    });
                });
                inputInfo.push(info);
            });
            types.forEach((buttercupType) => {
                let inputCandidates = inputInfo
                    .filter(info => Object.keys(info.matchedTypes).indexOf(buttercupType) >= 0);
                inputCandidates.sort(function(a, b) {
                    let aVal = a.matchedTypes[buttercupType],
                        bVal = b.matchedTypes[buttercupType];
                    if (aVal < bVal) {
                        return -1;
                    } else if (aVal > bVal) {
                        return 1;
                    }
                    return 0;
                });
                if (inputCandidates.length > 0) {
                    //data[buttercupType] = inputCandidates[0].input.value;
                    this.inputs[buttercupType] = inputCandidates[0].input;
                }
            });
        }

    }

    return Form;

});
