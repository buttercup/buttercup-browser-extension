(function() {
    setInterval(() => {
        chrome.runtime.sendMessage({ type: "keepAlive" });
    }, 20000);
})();
