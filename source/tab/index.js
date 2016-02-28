require(["LoginForm/Searcher"], function(LoginFormSearcher) {

    "use strict";

    console.log("Buttercup");

    function loginFormSubmitted(event) {
        let form = event.target,
            data = LoginFormSearcher.getLoginData(form);
        console.log("Send", data);
        chrome.runtime.sendMessage(
            {
                command: "stashLogin",
                data: data
            },
            function() {}
        );
    }

    LoginFormSearcher.getLoginForms().forEach(function(form) {
        console.log("Attached Buttercup login watcher:", form);
        form.addEventListener("submit", loginFormSubmitted);
    });

});
