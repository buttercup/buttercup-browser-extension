export function arrayBufferToHex(buffer: ArrayBuffer): string {
    return [...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

export function arrayBufferToString(buffer: ArrayBuffer): string {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

export function base64DecodeUnicode(str: string): string {
    return window.atob(str);
}

export function base64EncodeUnicode(str: string): string {
    return window.btoa(str);
}

export function stringToArrayBuffer(str: string): ArrayBuffer {
    const buffer = new ArrayBuffer(str.length);
    const bufferView = new Uint8Array(buffer);
    for (let i = 0; i < str.length; i += 1) {
        bufferView[i] = str.charCodeAt(i);
    }
    return buffer;
}
