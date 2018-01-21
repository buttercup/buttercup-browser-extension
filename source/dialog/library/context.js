import postRobot from "post-robot";

export function closeDialog() {
    return postRobot.send(window.top, "bcup-close-dialog");
}

export function getTopURL() {
    return postRobot.send(window.top, "bcup-get-url").then(response => {
        return response.data;
    });
}
