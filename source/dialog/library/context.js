import postRobot from "post-robot";

export function getTopURL() {
    return postRobot.send(window.top, "bcup-get-url").then(response => {
        return response.data;
    });
}
