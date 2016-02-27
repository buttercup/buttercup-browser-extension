define("LoginForm/SearchPatterns", function() {

    "use strict";

    return {

        forms: [

            {
                expression: /signin/i,
                properties: ["name", "id"]
            },

            {
                expression: /login/i,
                properties: ["name", "id"]
            }

        ],

        inputs: [

            {
                expression: /(username|userid)/i,
                properties: ["name", "id"],
                buttercup: "username"
            },
            {
                expression: /username/i,
                properties: ["placeholder"],
                buttercup: "username"
            },

            {
                expression: /^pass/i,
                properties: ["id", "name"],
                buttercup: "password"
            },
            {
                expression: /password/i,
                properties: ["placeholder"],
                buttercup: "password"
            },
            {
                expression: /^password$/i,
                properties: ["type"],
                buttercup: "password"
            }

        ]

    };

});
