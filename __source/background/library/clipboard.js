export function writeToClipboard(text) {
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.value = text;
    input.focus();
    input.select();
    document.execCommand("Copy");
    input.remove();
}
