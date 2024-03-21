(function() {
    setInterval(() => {
        chrome.runtime.sendMessage({ type: "keepAlive" }).catch(err => {
            console.error("Failed sending offscreen message", err);
        });
    }, 20000);
})();
