import { Layerr } from "layerr";

export async function copyTextToClipboard(text: string): Promise<void> {
    // Navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
    } else {
        // Use the 'out of viewport hidden text area' trick
        const textArea = document.createElement("textarea");
        textArea.value = text;
        // Move textarea out of the viewport so it's not visible
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
        document.body.prepend(textArea);
        textArea.select();
        try {
            document.execCommand("copy");
        } catch (error) {
            throw new Layerr(error, "Failed copying text");
        } finally {
            textArea.remove();
        }
    }
}
