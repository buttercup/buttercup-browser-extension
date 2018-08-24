import postRobot from "post-robot";

postRobot.CONFIG.LOG_LEVEL = "error";

export function closeDialog() {
    return postRobot.send(window.top, "bcup-close-dialog");
}

export function getTopURL() {
    return postRobot.send(window.top, "bcup-get-url").then(response => {
        return response.data;
    });
}

export function openURL(url) {
    return postRobot.send(window.top, "bcup-open-url", { url });
}
