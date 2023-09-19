export function arrayBufferToString(buffer: ArrayBuffer): string {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

export function base64DecodeUnicode(str: string): string {
    return window.atob(str);
    return decodeURIComponent(
        Array.prototype.map
            .call(atob(str), (c: string) => {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
    );
}

export function base64EncodeUnicode(str: string): string {
    return window.btoa(str);
    return btoa(
        encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
            // @ts-ignore
            return String.fromCharCode(`0x${p1}`);
        })
    );
}

export function stringToArrayBuffer(str: string): ArrayBuffer {
    const buffer = new ArrayBuffer(str.length);
    const bufferView = new Uint8Array(buffer);
    for (let i = 0; i < str.length; i += 1) {
        bufferView[i] = str.charCodeAt(i);
    }
    return buffer;
}
