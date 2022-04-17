const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;

export function setInputValue(input, value) {
    nativeInputValueSetter.call(input, value);
    const inputEvent = new Event("input", { bubbles: true });
    input.dispatchEvent(inputEvent);
    const changeEvent = new Event("change", { bubbles: true });
    input.dispatchEvent(changeEvent);
}
