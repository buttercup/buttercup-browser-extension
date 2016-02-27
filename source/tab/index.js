require(["LoginForm/Searcher"], function(LoginFormSearcher) {

    "use strict";

    console.log("Buttercup");

    console.log("Searching for login forms...");
    LoginFormSearcher.getLoginForms().forEach(function(form) {
        console.log("Login form:", form);
        let data = LoginFormSearcher.getLoginData(form);
        console.log(" -- Data:", data);
    });

});
