import "console.style";

function logError(...args) {
    writeLog("error", ...args);
}

function logInfo(...args) {
    writeLog("info", ...args);
}

function logWarn(...args) {
    writeLog("warn", ...args);
}

function styleType(type) {
    const outputType = `[${type}]`;
    switch (type) {
        case "info":
            return `<css="color:#00c;font-weight:bold;">${outputType}</css>`;
        case "error":
            return `<css="color:#c00;font-weight:bold;text-decoration:underline;">${outputType}</css>`;
        case "warn":
            return `<css="color:#fa1;font-weight:bold;">${outputType}</css>`;
        default:
            return outputType;
    }
}

function writeLog(type, ...args) {
    console.style(styleType(type), ...args);
}

export default {
    error: logError,
    info: logInfo,
    warn: logWarn
};
