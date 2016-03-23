require(["LoginForm/Searcher"], function(LoginFormSearcher) {

    "use strict";

    console.log("Buttercup");

    function loginFormSubmitted(form) {
        // let form = event.target,
        //     data = LoginFormSearcher.getLoginData(form);
        let data = LoginFormSearcher.getLoginData(form);
        console.log("Send", data);
        chrome.runtime.sendMessage(
            {
                command: "stashLogin",
                data: data
            },
            function() {}
        );
    }

    // -- Init

    chrome.runtime.sendMessage(
        {
            command: "getEntriesForURL",
            url: window.location.href
        },
        function(data) {
            console.log("Entries", data.entries);

            LoginFormSearcher.getLoginForms().forEach(function(loginForm) {
                console.log("Attached Buttercup login watcher:", loginForm.form);
                loginForm.form.addEventListener("submit", function(event) {
                    loginFormSubmitted(loginForm);
                });
            });
        }
    );

});
